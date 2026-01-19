import { type NextRequest, NextResponse } from "next/server"

const BITRIX_WEBHOOK = "https://gooo.bitrix24.ru/rest/1/svmyhxbnueexbp2y/crm.lead.add.json"

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 10 * 60 * 1000 }) // 10 minutes
    return true
  }

  if (limit.count >= 3) {
    return false
  }

  limit.count++
  return true
}

function sanitizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "")
}

function generateWhatsAppLink(phone: string): string {
  const clean = sanitizePhone(phone).replace(/^\+/, "")
  return `https://wa.me/${clean}`
}

function generateTelegramEmail(username: string): string {
  const clean = username.replace(/^@/, "").trim()
  return `${clean}@telegram.chatapp.online`
}

function generateTelegramLink(username: string): string {
  const clean = username
    .replace(/^@/, "")
    .replace(/@telegram\.chatapp\.online$/, "")
    .trim()
  return `https://t.me/${clean}`
}

function getServiceTypeListId(value: string): number | null {
  const map: Record<string, number> = {
    university: 58, // Universitetga kirmoqchi
    residence: 60, // Yashash ruxsatnomasi uchun
    visa_deport: 62, // Deport / viza masalasi
  }
  return map[value] || null
}

function getMessengerListId(value: string): number | null {
  const map: Record<string, number> = {
    WhatsApp: 802,
    Telegram: 804,
  }
  return map[value] || null
}

function getCountryListId(value: string): number | null {
  const map: Record<string, number> = {
    Turkiya: 230,
    AQSH: 232,
    "Buyuk Britaniya": 234,
    Germaniya: 236,
    Kanada: 238,
    Avstraliya: 240,
    "Janubiy Koreya": 1272,
    Yaponiya: 1274,
    Xitoy: 1276,
    Malayziya: 1278,
    Boshqa: 1304,
  }
  return map[value] || null
}

function getSemesterListId(value: string): number | null {
  const map: Record<string, number> = {
    "2025-2026 Bahor": 1342,
    "2026-2027 Kuz": 1344,
  }
  return map[value] || null
}

function getLevelListId(value: string): number | null {
  const map: Record<string, number> = {
    Tehnikum: 516,
    Bakalavr: 518,
    Magistratura: 520,
    Doktorantura: 664,
    "Til kurslari": 1256,
    Foundation: 1258,
  }
  return map[value] || null
}

function getBudgetListId(value: string): number | null {
  const map: Record<string, number> = {
    "1000-3000$": 1306,
    "3000-5000$": 1308,
    "5000-7000$": 1310,
    "7000-10000$": 1312,
    "10000-30000$": 1314,
  }
  return map[value] || null
}

function getResidenceTypeListId(value: string): number | null {
  const map: Record<string, number> = {
    Talaba: 1504,
    Oilaviy: 1506,
    Turistik: 1508,
    Boshqa: 1510,
  }
  return map[value] || null
}

function getApplicationTypeListId(value: string): number | null {
  const map: Record<string, number> = {
    Yangi: 1498,
    Uzaytirish: 1500,
    "Rad etilgan": 1502,
  }
  return map[value] || null
}

function getDocumentsStatusListId(value: string): number | null {
  const map: Record<string, number> = {
    "To'liq": 1492,
    Qisman: 1494,
    "Yo'q": 1496,
  }
  return map[value] || null
}

function getHasDeportCodeListId(value: string): number | null {
  const map: Record<string, number> = {
    ha: 1512,
    "yo'q": 1514,
  }
  return map[value] || null
}

function getDeportPeriodListId(value: string): number | null {
  const map: Record<string, number> = {
    "3 oy": 1524,
    "6 oy": 1516,
    "1 yil": 1518,
    "2 yil": 1520,
    "5 yil": 1522,
    Bilmayman: 1526,
  }
  return map[value] || null
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 })
    }

    const body = await req.json()

    console.log("[v0] Received payload:", JSON.stringify(body, null, 2))

    const {
      name,
      phone,
      sourceWhere,
      contactMethod,
      whatsappNumber,
      telegramUsername,
      serviceType,
      // University fields
      country,
      startSemester,
      level,
      budget,
      university,
      faculty,
      // Residence fields
      residenceType,
      applicationType,
      documentsStatus,
      lastEntryDate,
      // Deport fields
      deportPeriod,
      hasDeportCode,
      deportCode,
      deportDate,
      // Common fields
      age,
      city,
      additionalInfo,
      honeypot,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
    } = body

    // Honeypot check
    if (honeypot) {
      console.log("[v0] Honeypot triggered")
      return NextResponse.json({ success: false, error: "Spam detected" }, { status: 400 })
    }

    // Validation
    if (!name || !phone || !sourceWhere || !contactMethod || !serviceType) {
      console.log("[v0] Missing required fields:", { name, phone, sourceWhere, contactMethod, serviceType })
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          missing: {
            name: !name,
            phone: !phone,
            sourceWhere: !sourceWhere,
            contactMethod: !contactMethod,
            serviceType: !serviceType,
          },
        },
        { status: 400 },
      )
    }

    if (contactMethod === "WhatsApp" && !whatsappNumber) {
      console.log("[v0] WhatsApp number required")
      return NextResponse.json({ success: false, error: "WhatsApp number required" }, { status: 400 })
    }

    if (contactMethod === "Telegram" && !telegramUsername) {
      console.log("[v0] Telegram username required")
      return NextResponse.json({ success: false, error: "Telegram username required" }, { status: 400 })
    }

    const fields: any = {
      TITLE: `${name} - ${serviceType === "university" ? "Universitet" : serviceType === "residence" ? "Ikamet" : "Deport"} (Sayt)`,
      NAME: name,
      PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }],
      UF_CRM_1757026630556: sourceWhere, // Qayerdan murojaat qilyapti
      UF_CRM_1759928351454: getMessengerListId(contactMethod), // Messenjer (LIST ID)
      UF_CRM_1756745905172: getServiceTypeListId(serviceType), // Qaysi xizmat (LIST ID)
    }

    // Add UTM fields
    if (utm_source) fields.UF_CRM_1764975216803 = utm_source
    if (utm_medium) fields.UF_CRM_1764975229952 = utm_medium
    if (utm_campaign) fields.UF_CRM_1764975238634 = utm_campaign
    if (utm_content) fields.UF_CRM_1764975247167 = utm_content

    // Add messenger-specific fields
    if (contactMethod === "WhatsApp" && whatsappNumber) {
      // WhatsApp link: wa.me/{raqam} (https:// siz)
      const cleanPhone = sanitizePhone(whatsappNumber).replace(/^\+/, "")
      fields.UF_CRM_1759922632751 = `https://wa.me/${cleanPhone}`
    } else if (contactMethod === "Telegram" && telegramUsername) {
      // Telegram username ni tozalash (@ va email qismini olib tashlash)
      const cleanUsername = telegramUsername
        .replace(/^@/, "")
        .replace(/@telegram\.chatapp\.online$/, "")
        .trim()

      fields.UF_CRM_1759923282706 = `https://t.me/${cleanUsername}`

      fields.EMAIL = [{ VALUE: `${cleanUsername}@telegram.chatapp.online`, VALUE_TYPE: "WORK" }]
    }

    if (serviceType === "university") {
      if (country) fields.UF_CRM_1757026574200 = getCountryListId(country) // Davlat
      if (startSemester) fields.UF_CRM_1765888494541 = getSemesterListId(startSemester) // Semestr
      if (level) fields.UF_CRM_1757027113221 = getLevelListId(level) // Daraja
      if (budget) fields.UF_CRM_1765883694191 = getBudgetListId(budget) // Byudjet
      if (age) fields.UF_CRM_1757026723078 = age // Yosh
      if (additionalInfo) fields.UF_CRM_1765899497460 = additionalInfo // Qo'shimcha izoh
    } else if (serviceType === "residence") {
      if (residenceType) fields.UF_CRM_1765906148304 = getResidenceTypeListId(residenceType) // Ikamet turi
      if (applicationType) fields.UF_CRM_1765906051068 = getApplicationTypeListId(applicationType) // Murojaat turi
      if (documentsStatus) fields.UF_CRM_1765905993606 = getDocumentsStatusListId(documentsStatus) // Hujjatlar holati
      if (lastEntryDate) fields.UF_CRM_1757026917728 = lastEntryDate // Turkiyaga kirish sanasi
      if (age) fields.UF_CRM_1757026723078 = age // Yosh
      if (additionalInfo) fields.UF_CRM_1765899497460 = additionalInfo // Qo'shimcha izoh
    } else if (serviceType === "visa_deport") {
      if (deportPeriod) fields.UF_CRM_1765906814687 = getDeportPeriodListId(deportPeriod) // Deport muddati
      if (hasDeportCode) fields.UF_CRM_1765906762554 = getHasDeportCodeListId(hasDeportCode) // Deport kodi bormi
      if (deportCode) fields.UF_CRM_1757027227053 = deportCode // Deport kodi (text)
      if (deportDate) fields.UF_CRM_1765922158 = deportDate // Deport sanasi
      if (age) fields.UF_CRM_1757026723078 = age // Yosh
      if (additionalInfo) fields.UF_CRM_1765899497460 = additionalInfo // Qo'shimcha izoh
    }

    // Send to Bitrix
    console.log("[v0] Sending to Bitrix:", JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: "Y" } }, null, 2))

    const response = await fetch(BITRIX_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: "Y" } }),
    })

    const data = await response.json()

    if (!response.ok || !data.result) {
      console.error("[v0] Bitrix error:", data)
      return NextResponse.json({ success: false, error: "Failed to create lead", details: data }, { status: 500 })
    }

    console.log("[v0] Bitrix success:", data)
    return NextResponse.json({ success: true, leadId: data.result })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
