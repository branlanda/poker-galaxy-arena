
import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/stores/language";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { vi } from "vitest";

// Mock the language store for Storybook
vi.mock("@/stores/language", () => ({
  useLanguage: () => ({
    currentLanguage: { code: "en", name: "English", flag: "🇺🇸" },
    setLanguage: () => {},
  }),
  languages: [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ],
}));

const meta: Meta<typeof LanguageSelector> = {
  title: "Components/LanguageSelector",
  component: LanguageSelector,
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof LanguageSelector>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
