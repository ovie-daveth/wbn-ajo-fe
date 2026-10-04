import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState('pro');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-5 gap-5 pb-10">
        <VStack className="gap-1">
          <Heading className="text-2xl font-extrabold">Components</Heading>
          <Text className="text-typography-gray">
            Form controls, feedback and layout — all Gluestack + NativeWind.
          </Text>
        </VStack>

        <Card className="gap-4 rounded-2xl p-5">
          <Heading className="text-lg">Profile</Heading>

          <VStack className="gap-1.5">
            <Text className="text-sm font-medium">Name</Text>
            <Input>
              <InputField
                placeholder="Ada Lovelace"
                value={name}
                onChangeText={setName}
              />
            </Input>
          </VStack>

          <VStack className="gap-1.5">
            <Text className="text-sm font-medium">Bio</Text>
            <Textarea>
              <TextareaInput
                placeholder="Tell us about your ajo group…"
                value={bio}
                onChangeText={setBio}
              />
            </Textarea>
          </VStack>

          <HStack className="items-center justify-between">
            <VStack>
              <Text className="font-medium">Notifications</Text>
              <Text className="text-sm text-typography-gray">Payout reminders</Text>
            </VStack>
            <Switch value={notifications} onValueChange={setNotifications} />
          </HStack>

          <VStack className="gap-2">
            <Text className="text-sm font-medium">Plan</Text>
            <RadioGroup value={plan} onChange={setPlan}>
              <HStack className="gap-4">
                <Radio value="free">
                  <RadioIndicator>
                    <RadioIcon />
                  </RadioIndicator>
                  <RadioLabel>Free</RadioLabel>
                </Radio>
                <Radio value="pro">
                  <RadioIndicator>
                    <RadioIcon />
                  </RadioIndicator>
                  <RadioLabel>Pro</RadioLabel>
                </Radio>
              </HStack>
            </RadioGroup>
          </VStack>

          <Checkbox value="agree" isChecked={agreed} onChange={setAgreed}>
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>I agree to the group rules</CheckboxLabel>
          </Checkbox>

          <Button onPress={submit} isDisabled={!agreed} className="mt-1">
            {loading && <ButtonSpinner />}
            <ButtonText>{loading ? 'Saving…' : `Save${name ? ` — ${name}` : ''}`}</ButtonText>
          </Button>
        </Card>

        <Card className="rounded-2xl bg-secondary p-5">
          <Heading className="text-secondary-foreground">State preview</Heading>
          <Text className="mt-1 text-sm text-secondary-foreground/80">
            name: {name || '—'} • plan: {plan} • notifications:{' '}
            {notifications ? 'on' : 'off'} • agreed: {agreed ? 'yes' : 'no'}
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
