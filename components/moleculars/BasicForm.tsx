// components/molecules/BasicForm.tsx

import React, { useCallback } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import BasicInput from '@/components/atoms/BasicInput';
import BasicButton from '@/components/atoms/BasicButton';
import commonStyles from '@/styles/commonStyles';
import { BasicFormProps } from '@/types/component.type';

export default (props: BasicFormProps) => {
    const {
        fields,
        disabled,
        loading,
        onSubmit,
        submitButtonTitle,
        secondaryButtonTitle,
        onSecondaryButtonPress,
      } = props
  const styles = commonStyles();

  const renderFields = useCallback(
    () =>
      fields.map((field) => (
        <BasicInput
          key={field.name}
          value={field.value}
          disabled={disabled}
          onChangeText={field.setValue}
          placeholder={field.placeholder}
          secureTextEntry={Boolean(field.secureTextEntry)}
        />
      )),
    [fields]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.form}
    >
      {renderFields()}
      <BasicButton title={submitButtonTitle} onPress={onSubmit} disabled={disabled} loading={loading} />
      {secondaryButtonTitle && onSecondaryButtonPress && (
        <BasicButton
          title={secondaryButtonTitle}
          outlined
          onPress={onSecondaryButtonPress}
          disabled={disabled}
        />
      )}
    </KeyboardAvoidingView>
  );
}
