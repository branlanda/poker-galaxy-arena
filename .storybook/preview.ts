
import type { Preview } from "@storybook/react";
import '../src/index.css';
import i18n from '../src/i18n';

// Force the initialization of i18n
import { I18nextProvider } from 'react-i18next';
import React from 'react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0B1F32',
        },
        {
          name: 'light',
          value: '#F8F9FA',
        },
      ],
    },
    a11y: {
      // Optional configuration
      config: {
        rules: [
          {
            // You can adjust which accessibility rules are checked
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    (Story) => {
      return React.createElement(I18nextProvider, { i18n }, Story());
    },
  ],
};

export default preview;
