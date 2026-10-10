import { useState } from 'react';
import { Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { ThemedIcon } from '@/components/common/ThemedIcon';

type PasswordFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
};

/** Password input with a show/hide eye toggle. */
export function PasswordField({ value, onChangeText, placeholder = '••••••••', onSubmitEditing }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <HStack className="items-center gap-2">
      <Input className="flex-1">
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoComplete="password"
          onSubmitEditing={onSubmitEditing}
        />
      </Input>
      <Pressable
        onPress={() => setVisible((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        hitSlop={8}
        className="h-11 w-11 items-center justify-center rounded-full bg-secondary"
      >
        <ThemedIcon icon={visible ? EyeOff : Eye} size={20} />
      </Pressable>
    </HStack>
  );
}
