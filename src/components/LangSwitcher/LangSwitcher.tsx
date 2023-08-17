import { Select } from "@chakra-ui/react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const { locale } = useRouter();
  console.log(locale);
  const localPath = locale === "en" ? "ar" : "en";
  return (
    <div>
      <Link
        href={`/${localPath}/login`}
        locale="ar"
        style={{ textAlign: "center", marginTop: "10px" }}
      >
        {locale === "en" ? "عربي" : "English"}
      </Link>
    </div>
  );
}
