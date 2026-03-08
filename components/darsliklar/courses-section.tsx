"use client"

import { BookOpen, Clock, Users, ArrowRight, Gift } from "lucide-react"

interface Course {
  slug: string
  title: string
  description: string
  duration: string
  students: string
  [key: string]: any
}

interface CoursesSectionProps {
  courses: Course[]
  onSelectCourse: (slug: string) => void
}

export function CoursesSection({ courses, onSelectCourse }: CoursesSectionProps) {
  return (
    <section id="courses" className="min-h-screen flex items-center bg-[#f0fdf4] px-4 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#064e3b] px-4 py-2 text-sm font-bold text-amber-400 mb-4">
            <Gift className="h-4 w-4" />
            3 ta dars BEPUL
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-3 text-balance">
            {"O'zingizga mos kursni tanlang"}
          </h2>
          <p className="text-[#6b7280] text-base sm:text-lg">
            {"va bugun BEPUL boshlang!"}
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.slug}
              className="group cursor-pointer rounded-2xl bg-white p-5 sm:p-6 border border-[#e5e7eb] shadow-sm hover:shadow-xl hover:border-[#a7f3d0] transition-all duration-300 hover:-translate-y-1"
              onClick={() => onSelectCourse(course.slug)}
            >
              {/* Free Badge */}
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-[#064e3b]">
                <Gift className="h-3 w-3" />
                3 ta dars BEPUL
              </div>

              {/* Course Icon */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0fdf4] border border-[#a7f3d0] group-hover:bg-[#059669] group-hover:border-[#059669] transition-colors">
                <BookOpen className="h-7 w-7 text-[#059669] group-hover:text-white transition-colors" />
              </div>

              {/* Title */}
              <h3 className="mb-2 text-lg sm:text-xl font-bold text-[#111827] group-hover:text-[#059669] transition-colors">
                {course.title}
              </h3>
              <p className="mb-4 text-sm text-[#6b7280] line-clamp-2">{course.description}</p>

              {/* Stats */}
              <div className="mb-4 flex flex-wrap gap-3 text-sm text-[#6b7280]">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{course.students}+ o{"'"}quvchi</span>
                </div>
              </div>

              {/* CTA */}
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#059669] hover:bg-[#047857] px-4 py-3 text-sm font-bold text-white transition-all">
                Batafsil
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
