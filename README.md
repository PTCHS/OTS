# OTS (Overseering The Service)

봉사 활동 관리 시스템

## 프로젝트 소개

OTS(Overseering The Service)는 봉사 활동을 효율적으로 관리할 수 있는 웹 애플리케이션입니다.

### 주요 기능

- 📅 **캘린더**: 봉사 일정 관리
- 🗺️ **구역 관리**: 담당 구역 및 영역 관리
- 👤 **프로필**: 사용자 정보 관리
- ⚙️ **설정**: 시스템 설정
- 🔔 **알림**: 공지사항 및 알림 관리
- 🏠 **홈 대시보드**: 공지사항 및 오늘의 봉사 정보

## 기술 스택

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

개발 서버 실행:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
│   ├── calendar/        # 캘린더 페이지
│   ├── home/           # 홈 페이지
│   ├── territory/      # 구역 관리 페이지
│   ├── profile/        # 프로필 페이지
│   ├── settings/       # 설정 페이지
│   └── notifications/  # 알림 페이지
├── components/         # 재사용 가능한 컴포넌트
│   ├── auth/          # 인증 관련 컴포넌트
│   ├── layout/        # 레이아웃 컴포넌트
│   ├── ui/            # UI 컴포넌트
│   └── providers/     # Context Provider
└── lib/               # 유틸리티 및 설정
    ├── contexts.tsx   # React Context
    ├── supabase.ts   # Supabase 설정
    └── utils.ts      # 유틸리티 함수
```

## Learn More

Next.js에 대해 더 알아보려면 다음 리소스를 참고하세요:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js 기능과 API 학습
- [Learn Next.js](https://nextjs.org/learn) - 인터랙티브 Next.js 튜토리얼

[Next.js GitHub repository](https://github.com/vercel/next.js)를 확인해보세요 - 피드백과 기여를 환영합니다!

## Deploy on Vercel

Next.js 앱을 배포하는 가장 쉬운 방법은 Next.js 제작자가 만든 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)을 사용하는 것입니다.

자세한 내용은 [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)을 확인하세요.
