import { Search2Icon, SpinnerIcon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import styles from './styles.module.scss';

// props
interface SearchInputProps {
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadingState: boolean;
}
// input loading state

const SearchInput: React.FC<{ data: SearchInputProps }> = ({ data }) => {
  // distruct props
  const { handleFormChange, loadingState } = data;
  // trans
  const { t } = useTranslation('createChat');
  return (
    <InputGroup className={styles.search_input}>
      <InputLeftElement pointerEvents='none'>
        <Search2Icon color='gray.300' />
      </InputLeftElement>
      <Input
        type='text'
        placeholder={t('search_usr_placeholder')}
        variant='filled'
        borderRadius={'2xl'}
        onChange={handleFormChange}
      />
      {/* loading indecator */}
      <InputRightElement>
        {loadingState ? (
          <SpinnerIcon color={'gray.400'} className={styles.loader_icon} />
        ) : (
          ''
        )}
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
