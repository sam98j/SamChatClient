import React from 'react';
import styles from './styles.module.scss';
import { Box, Text } from '@chakra-ui/react';
import Image from 'next/image';
import SVG from '../../../assets/vectors/undraw_phone_call_re_hx6a.svg';

const Calls = () => {
  return (
    <div className={styles.calls}>
      {/* svg */}
      <Box className={styles.svg_container}>
        <Image src={SVG} alt='' />
        <Text textAlign={'center'} fontSize={'2rem'}>
          NO Calls Yet...
        </Text>
      </Box>
    </div>
  );
};

export default Calls;
