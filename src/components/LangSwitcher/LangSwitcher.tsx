import { Select } from "@chakra-ui/react";
import styles from "./styles.module.scss";

export default function LanguageSwitcher() {
  return (
    <Select placeholder="Select App Language">
      <option value="en">English</option>
      <option value="ar">عربي</option>
    </Select>
  );
}
