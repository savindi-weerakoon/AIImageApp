export type BasicButtonProps = {
    title: string
    outlined?: boolean
    onPress: () => void
    disabled?: boolean
}

export type BasicInputProps = {
    value?: string
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
    onSubmit: () => void;
    submitButtonTitle: string;
    secondaryButtonTitle?: string;
    onSecondaryButtonPress?: () => void;
  };