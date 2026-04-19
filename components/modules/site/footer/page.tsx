import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import styles from "./SiteFooter.module.scss";

type ServiceItem = {
  id: number;
  title: string;
  link: string;
};

type Props = {
  siteName?: string;
  footerLogo?: string | null;
  address?: string | null;
  email?: string | null;
  hotline?: string | null;
  hotlineDisplay?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  zaloPhone?: string | null;
  copyrightText?: string | null;
  services?: ServiceItem[];
};

export default function Footer({
  siteName = "KING LIMOUSINE",
  footerLogo,
  address,
  email,
  hotline,
  hotlineDisplay,
  facebookUrl,
  instagramUrl,
  zaloPhone,
  copyrightText,
  services = [],
}: Props) {
  const phoneText = hotlineDisplay || hotline || "";
  const phoneHref = hotline ? `tel:${hotline}` : undefined;
  const emailHref = email ? `mailto:${email}` : undefined;
  const zaloHref = zaloPhone ? `https://zalo.me/${zaloPhone}` : undefined;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoLink} aria-label={siteName}>
              {footerLogo ? (
                <div className={styles.logoWrap}>
                  <Image
                    src={footerLogo}
                    alt={siteName}
                    fill
                    className={styles.logo}
                    sizes="260px"
                  />
                </div>
              ) : (
                <div className={styles.textLogo}>{siteName}</div>
              )}
            </Link>

            <div className={styles.contactList}>
              {address ? (
                <div className={styles.contactItem}>
                  <MapPin size={18} strokeWidth={1.8} />
                  <span>{address}</span>
                </div>
              ) : null}

              {email && emailHref ? (
                <a href={emailHref} className={styles.contactItem}>
                  <Mail size={18} strokeWidth={1.8} />
                  <span>{email}</span>
                </a>
              ) : null}

              {phoneText && phoneHref ? (
                <a href={phoneHref} className={styles.contactItem}>
                  <Phone size={18} strokeWidth={1.8} />
                  <span>{phoneText}</span>
                </a>
              ) : null}
            </div>
          </div>

          <div className={styles.serviceCol}>
            <h3 className={styles.colTitle}>CÁC DỊCH VỤ</h3>

            <div className={styles.linkList}>
              {services.length > 0 ? (
                services.map((service) => (
                  <Link
                    key={service.id}
                    href={service.link}
                    className={styles.footerLink}
                  >
                    {service.title}
                  </Link>
                ))
              ) : (
                <span className={styles.footerEmpty}>Đang cập nhật dịch vụ</span>
              )}
            </div>
          </div>

          <div className={styles.socialCol}>
            <h3 className={styles.colTitle}>KẾT NỐI VỚI CHÚNG TÔI</h3>

            <div className={styles.socialList}>
              {facebookUrl ? (
                <Link
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  <span className={styles.socialIcon}>
                    <ArrowUpRight size={16} strokeWidth={2.2} />
                  </span>
                  <span className={styles.socialText}>FACEBOOK</span>
                </Link>
              ) : null}

              {instagramUrl ? (
                <Link
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  <span className={styles.socialIcon}>
                    <ArrowUpRight size={16} strokeWidth={2.2} />
                  </span>
                  <span className={styles.socialText}>INSTAGRAM</span>
                </Link>
              ) : null}

              {zaloHref ? (
                <Link
                  href={zaloHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  <span className={styles.socialIcon}>
                    <ArrowUpRight size={16} strokeWidth={2.2} />
                  </span>
                  <span className={styles.socialText}>ZALO</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}