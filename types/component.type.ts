export type BasicButtonProps = {
    title: string
    outlined?: boolean
    onPress: () => void
    disabled?: boolean
    loading?: boolean
}

export type BasicInputProps = {
    value?: string
    disabled?: boolean
    placeholder?: string
    onChangeText: (value: string) => void
    secureTextEntry?: boolean
}

type FormField = {
    name: string;
    placeholder: string;
    value: string;
    setValue: (value: string) => void;
    secureTextEntry?: boolean;
  };
  
export type BasicFormProps = {
    fields: FormField[];
    disabled?: boolean;
    loading?: boolean;
    onSubmit: () => void;
    submitButtonTitle: string;
    secondaryButtonTitle?: string;
    onSecondaryButtonPress?: () => void;
  };