import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';
import { Avatar, AvatarFallbackText, AvatarGroup, AvatarImage } from '@/components/ui/avatar';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { InfoIcon } from '@/components/ui/icon';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabOneScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-5 gap-5 pb-10">
        {/* Hero */}
        <VStack className="gap-3 rounded-2xl bg-primary p-6">
          <Badge className="self-start bg-white/20">
            <BadgeText className="text-white">NativeWind v4 + Gluestack v4</BadgeText>
          </Badge>
          <Heading className="text-3xl font-extrabold text-white">
            Build beautiful apps, fast.
          </Heading>
          <Text className="text-base text-white/80">
            Expo Router + Tailwind utilities + copy-paste Gluestack components. Styled
            entirely with className.
          </Text>
          <HStack className="mt-2 gap-3">
            <Button className="bg-white">
              <ButtonText className="text-primary">Get Started</ButtonText>
            </Button>
            <Button variant="outline" className="border-white/40">
              <ButtonText className="text-white">Docs</ButtonText>
            </Button>
          </HStack>
        </VStack>

        {/* Stats */}
        <HStack className="gap-3">
          <Card className="flex-1 rounded-2xl p-4">
            <Heading className="text-2xl font-extrabold">58</Heading>
            <Text className="text-sm text-typography-gray">Components</Text>
            <Progress value={85} className="mt-3">
              <ProgressFilledTrack />
            </Progress>
          </Card>
          <Card className="flex-1 rounded-2xl p-4">
            <Heading className="text-2xl font-extrabold">100%</Heading>
            <Text className="text-sm text-typography-gray">Native + Web</Text>
            <Progress value={100} className="mt-3">
              <ProgressFilledTrack />
            </Progress>
          </Card>
        </HStack>

        {/* Team */}
        <Card className="rounded-2xl p-5">
          <HStack className="items-center justify-between">
            <VStack className="gap-1">
              <Heading className="text-lg">Team Ajo</Heading>
              <Text className="text-sm text-typography-gray">4 members online</Text>
            </VStack>
            <AvatarGroup>
              <Avatar className="bg-primary">
                <AvatarFallbackText>OV</AvatarFallbackText>
              </Avatar>
              <Avatar className="bg-secondary">
                <AvatarFallbackText>WB</AvatarFallbackText>
              </Avatar>
              <Avatar>
                <AvatarImage
                  source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                  alt="member"
                />
              </Avatar>
              <Avatar className="bg-accent">
                <AvatarFallbackText>+9</AvatarFallbackText>
              </Avatar>
            </AvatarGroup>
          </HStack>
          <Divider className="my-4" />
          <Alert>
            <AlertIcon as={InfoIcon} />
            <AlertText>
              GluestackUIProvider is wired in app/_layout.tsx. Add components with copy-paste
              from components/ui.
            </AlertText>
          </Alert>
        </Card>

        {/* NativeWind proof */}
        <Box className="gap-2 rounded-2xl border border-border bg-card p-5">
          <Heading className="text-lg">NativeWind is working 🎉</Heading>
          <Text className="text-sm">
            This box uses only <Text className="font-bold">className</Text>: flex, gap,
            rounded-2xl, bg-card, border-border, dark mode tokens and more.
          </Text>
          <HStack className="mt-1 flex-wrap gap-2">
            <Badge><BadgeText>flex</BadgeText></Badge>
            <Badge variant="secondary"><BadgeText>gap-2</BadgeText></Badge>
            <Badge variant="outline"><BadgeText>rounded-2xl</BadgeText></Badge>
            <Badge variant="destructive"><BadgeText>dark:mode</BadgeText></Badge>
          </HStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
