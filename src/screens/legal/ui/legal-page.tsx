import Link from "next/link";
import { Container } from "@/src/shared/ui/container";

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageContent = {
  title: string;
  eyebrow: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export const legalPages = {
  privacy: {
    title: "Политика конфиденциальности",
    eyebrow: "Конфиденциальность",
    description:
      "Как SNABIX обрабатывает данные аккаунта, объявлений, обращений в поддержку и технические события сервиса.",
    updatedAt: "28 июня 2026",
    sections: [
      {
        title: "Какие данные мы обрабатываем",
        body: [
          "Данные аккаунта: имя, email, телефон, аватар, адреса профиля и настройки уведомлений.",
          "Данные объявлений: описание, цена, категория, характеристики, фотографии, регион, город и адресный снимок объявления.",
          "Технические данные: IP-адрес, user-agent, сведения о сессии, события авторизации и ошибки API для безопасности и диагностики.",
        ],
      },
      {
        title: "Зачем это нужно",
        body: [
          "Для регистрации, входа, публикации объявлений, избранного, уведомлений, модерации и защиты от злоупотреблений.",
          "Для поддержки пользователя и восстановления доступа, если аккаунт или email требуют подтверждения.",
        ],
      },
      {
        title: "Передача данных",
        body: [
          "Мы не продаём персональные данные. Доступ могут получать только сервисы, необходимые для работы продукта: хостинг, почта, хранение медиа, мониторинг и антиспам.",
          "Публичные данные объявления и профиля видны другим пользователям в пределах сценариев marketplace.",
        ],
      },
      {
        title: "Права пользователя",
        body: [
          "Пользователь может обновлять профиль, адреса и уведомления в личном кабинете.",
          "Для удаления или уточнения данных можно обратиться в поддержку. Часть технических записей может храниться ограниченное время для безопасности и аудита.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Доступность",
    eyebrow: "Инклюзивный интерфейс",
    description:
      "Мы проектируем SNABIX так, чтобы интерфейс оставался понятным, читаемым и управляемым для разных сценариев использования.",
    updatedAt: "28 июня 2026",
    sections: [
      {
        title: "Наши ориентиры",
        body: [
          "Читаемая типографика, контрастные состояния, явные focus-стили и понятная структура страниц.",
          "Поддержка клавиатурной навигации в ключевых элементах: меню, формы, карточки, диалоги и пагинация.",
        ],
      },
      {
        title: "Медиа и движение",
        body: [
          "Для декоративных анимаций учитывается системная настройка reduced motion.",
          "Изображения и интерактивные элементы должны иметь понятные альтернативные подписи или aria-label там, где это влияет на смысл.",
        ],
      },
      {
        title: "Что будем улучшать",
        body: [
          "Проверки с screen reader, e2e-сценарии клавиатурной навигации и единый accessibility checklist для новых компонентов.",
          "Отдельное внимание будет уделено формам объявлений, загрузке медиа и модальным окнам.",
        ],
      },
    ],
  },
  cookies: {
    title: "Файлы cookie",
    eyebrow: "Cookie и хранение",
    description:
      "Какие cookie и локальные настройки нужны SNABIX сейчас, а какие категории могут появиться только после явного внедрения.",
    updatedAt: "20 июля 2026",
    sections: [
      {
        title: "Обязательные cookie",
        body: [
          "XSRF-TOKEN используется Laravel Sanctum для защиты форм и API-запросов от CSRF-атак.",
          "Сессионные cookie backend нужны для авторизации, сохранения безопасной сессии и корректной работы личного кабинета.",
        ],
      },
      {
        title: "Локальные настройки",
        body: [
          "Тема сайта и режим автоматической темы сохраняются в localStorage, чтобы интерфейс не сбрасывался при обновлении страницы.",
          "Авторизация работает через защищенную серверную сессию Laravel Sanctum. Учетные данные не сохраняются frontend-кодом в доступном JavaScript локальном хранилище.",
        ],
      },
      {
        title: "Что мы пока не используем",
        body: [
          "Маркетинговые и рекламные cookie не подключены как обязательная часть продукта.",
          "Аналитические cookie стоит добавлять только после отдельного consent-слоя и понятного выбора пользователя.",
        ],
      },
    ],
  },
  policies: {
    title: "Политика и положения",
    eyebrow: "Правила платформы",
    description:
      "Базовые положения SNABIX: что можно публиковать, как работает модерация и какие действия недопустимы.",
    updatedAt: "28 июня 2026",
    sections: [
      {
        title: "Публикация объявлений",
        body: [
          "Объявление должно содержать достоверное описание, корректную категорию, цену, фотографии и актуальные контактные данные.",
          "Запрещены материалы, нарушающие закон, права третьих лиц, правила безопасности или вводящие пользователей в заблуждение.",
        ],
      },
      {
        title: "Модерация",
        body: [
          "SNABIX может отправлять объявления на проверку, архивировать, скрывать или удалять материалы при нарушении правил.",
          "Администрация может запросить уточнение данных, если объявление выглядит подозрительным или неполным.",
        ],
      },
      {
        title: "Ответственность пользователя",
        body: [
          "Пользователь отвечает за содержание объявлений, коммуникацию с покупателями и актуальность опубликованных данных.",
          "Платформа помогает организовать безопасный сценарий, но не является стороной сделки между пользователями.",
        ],
      },
      {
        title: "Развитие правил",
        body: [
          "Правила будут уточняться вместе с развитием платежей, отзывов, карт, уведомлений и дополнительных сервисов доверия.",
        ],
      },
    ],
  },
} satisfies Record<string, LegalPageContent>;

type LegalPageProps = {
  content: LegalPageContent;
};

export function LegalPage({ content }: LegalPageProps) {
  return (
    <main className="py-8 sm:py-12">
      <Container>
        <section className="surface-card relative overflow-hidden rounded-[34px] p-6 sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_72%)]" />

          <div className="relative max-w-4xl">
            <p className="section-kicker text-sm font-semibold uppercase tracking-[0.16em]">
              {content.eyebrow}
            </p>

            <h1 className="font-heading mt-4 text-4xl font-black leading-[1.05] text-[var(--brand-deep)] sm:text-5xl">
              {content.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-[var(--text-muted)]">
              {content.description}
            </p>

            <p className="mt-6 text-sm font-bold text-[var(--text-muted)]">
              Обновлено: {content.updatedAt}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4">
          {content.sections.map((section) => (
            <article
              className="surface-card rounded-[28px] p-6 sm:p-8"
              key={section.title}
            >
              <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
                {section.title}
              </h2>

              <div className="mt-4 grid gap-3 text-sm font-medium leading-7 text-[var(--text-muted)] sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <div className="mt-6 rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-5 text-sm font-semibold text-[var(--text-muted)]">
          Есть вопрос по правилам или данным? Напишите в поддержку или вернитесь на{" "}
          <Link className="text-[var(--brand-deep)] underline-offset-4 hover:underline" href="/">
            главную страницу
          </Link>
          .
        </div>
      </Container>
    </main>
  );
}
