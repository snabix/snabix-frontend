import { MapPin } from "lucide-react";
import type { UserAddress } from "@/src/entities/user";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { formatUserAddress } from "../lib/format-user-address";

type ProfileAddressesViewProps = {
  addresses: UserAddress[];
};

export function ProfileAddressesView({ addresses }: ProfileAddressesViewProps) {
  return (
    <section className="surface-card rounded-[32px] p-6 sm:p-8">
      <ProfileAddressesHeading
        description="Управлять адресами можно в настройках аккаунта, а здесь они отображаются только для просмотра."
        title="Ваши локации"
      />

      {addresses.length === 0 ? (
        <EmptyState
          description="Адреса пока не добавлены. Добавить их можно в настройках профиля."
          icon={MapPin}
          title="Адреса пока не указаны"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5"
              key={address.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg font-black text-[var(--brand-deep)]">
                    {formatUserAddress(address)}
                  </h3>
                  {address.label?.trim() ? (
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {address.label}
                    </p>
                  ) : null}
                </div>

                {address.isPrimary ? (
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-black text-[var(--brand-deep)]">
                    основной
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProfileAddressesHeading({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <MapPin aria-hidden="true" size={20} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          Адреса
        </p>

        <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
