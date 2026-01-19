import { type NextRequest, NextResponse } from "next/server"

const BITRIX_CONTACT_URL = "https://muhibacademy.bitrix24.kz/rest/1/c6llyvjpjzj7h78z/crm.contact.add.json"
const BITRIX_DEAL_URL = "https://muhibacademy.bitrix24.kz/rest/1/eu84ey6vrebqa3t2/crm.deal.add.json"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      phoneCountry,
      age,
      gender,
      country,
      level,
      contactMethod,
      whatsapp,
      telegram,
      course,
      courseId,
      shortCode,
    } = body

    // Split name into first and last name
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    // Format Telegram to t.me link and create email
    const cleanTelegram = telegram ? telegram.replace(/^@/, "") : ""
    const telegramLink = cleanTelegram ? `https://t.me/${cleanTelegram}` : ""
    const telegramEmail = cleanTelegram ? `${cleanTelegram}@telegram.chatapp.online` : ""

    // Format WhatsApp to wa.me link
    const cleanWhatsapp = whatsapp ? whatsapp.replace(/[^0-9]/g, "") : ""
    const whatsappLink = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : ""

    const shortUrlStatsLink = shortCode ? `https://muhibacademy.uz/s/${shortCode}/stats` : ""

    const contactFields = {
      NAME: firstName,
      LAST_NAME: lastName,
      PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }], // Already formatted as +998...
      EMAIL: telegramEmail ? [{ VALUE: telegramEmail, VALUE_TYPE: "WORK" }] : [],
    }

    const contactResponse = await fetch(BITRIX_CONTACT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: contactFields }),
    })

    const contactData = await contactResponse.json()

    if (!contactData.result) {
      console.error("Bitrix24 Contact error:", contactData)
      return NextResponse.json(
        {
          success: false,
          error: contactData.error_description || "Contact yaratishda xato",
        },
        { status: 400 },
      )
    }

    const contactId = contactData.result

    const dealFields = {
      TITLE: `${name} - ${course || "Darslik"}`,
      CONTACT_ID: contactId, // Link to created contact
      UF_CRM_1762609797890: Number.parseInt(age) || 0, // Age
      UF_CRM_1762609867288: Number.parseInt(gender) || 0, // Gender code
      UF_CRM_1768500113: country, // Country
      UF_CRM_1762609680665: Number.parseInt(level) || 0, // Level code
      UF_CRM_1768499381897: Number.parseInt(contactMethod) || 0, // Contact method code
      UF_CRM_1768499301767: whatsappLink, // WhatsApp link
      UF_CRM_1768499273042: telegramLink, // Telegram link
      UF_CRM_1768501957987: shortUrlStatsLink, // ShortURL stats link
      COMMENTS: `Kurs: ${course || "Darslik"}\nKurs ID: ${courseId || "N/A"}${shortCode ? `\nShortURL: muhibacademy.uz/s/${shortCode}` : ""}`,
    }

    // Remove empty fields
    Object.keys(dealFields).forEach((key) => {
      if (
        dealFields[key as keyof typeof dealFields] === undefined ||
        dealFields[key as keyof typeof dealFields] === "" ||
        (Array.isArray(dealFields[key as keyof typeof dealFields]) &&
          dealFields[key as keyof typeof dealFields].length === 0)
      ) {
        delete dealFields[key as keyof typeof dealFields]
      }
    })

    const dealResponse = await fetch(BITRIX_DEAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: dealFields }),
    })

    const dealData = await dealResponse.json()

    if (dealData.result) {
      try {
        await fetch(`${request.nextUrl.origin}/api/course-registration`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            bitrix_contact_id: contactId,
            bitrix_deal_id: dealData.result,
          }),
        })
      } catch (supabaseError) {
        console.error("Supabase save error:", supabaseError)
      }

      return NextResponse.json({
        success: true,
        contactId,
        dealId: dealData.result,
        message: "Contact va Deal muvaffaqiyatli yaratildi",
      })
    } else {
      console.error("Bitrix24 Deal error:", dealData)
      return NextResponse.json(
        {
          success: false,
          error: dealData.error_description || "Deal yaratishda xato",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Bitrix integration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server xatosi",
      },
      { status: 500 },
    )
  }
}
