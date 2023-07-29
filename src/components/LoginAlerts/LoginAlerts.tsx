import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";

const LoginAlerts: React.FC<{
  response: { err: boolean; msg: string } | null;
}> = ({ response }) => {
  return (
    <motion.div
      initial={{ top: "20px", opacity: 1 }}
      animate={{ top: "-120px", opacity: 0 }}
      transition={{ duration: 1, delay: 5 }}
    >
      <Alert
        status={response?.err ? "error" : "success"}
        className={styles.loginAlerts}
        textColor="black"
      >
        <AlertIcon />
        <Box>
          <AlertTitle>{response?.err ? "Faild !" : "Success"}</AlertTitle>
          <AlertDescription>{response?.msg}</AlertDescription>
        </Box>
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          top={-1}
          onClick={() => {}}
        />
      </Alert>
    </motion.div>
  );
};

export default LoginAlerts;
