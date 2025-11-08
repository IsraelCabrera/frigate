import type * as Preset from "@docusaurus/preset-classic";
import * as path from "node:path";
import type { Config, PluginConfig } from "@docusaurus/types";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

const config: Config = {
  title: "Security",
  tagline: "NVR With Realtime Object Detection for IP Cameras",
  url: "https://docs.security.video",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "blakeblackshear",
  projectName: "security",
  themes: [
    "@docusaurus/theme-mermaid",
    "docusaurus-theme-openapi-docs",
    "@inkeep/docusaurus/chatButton",
    "@inkeep/docusaurus/searchBar",
  ],
  markdown: {
    mermaid: true,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        label: 'English',
      }
    },
  },
  themeConfig: {
    announcementBar: {
      id: 'security_plus',
      content: `
        <span style="margin-right: 8px; display: inline-block; animation: pulse 2s infinite;">🚀</span>
        Get more relevant and accurate detections with Security+ models.
        <a style="margin-left: 12px; padding: 3px 10px; background: #94d2bd; color: #001219; text-decoration: none; border-radius: 4px; font-weight: 500; " target="_blank" rel="noopener noreferrer" href="https://security.video/plus/">Learn more</a>
        <span style="margin-left: 8px; display: inline-block; animation: pulse 2s infinite;">✨</span>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.1); }
          }
        </style>`,
      backgroundColor: '#005f73',
      textColor: '#e0fbfc',
      isCloseable: false,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    inkeepConfig: {
      baseSettings: {
        apiKey: "b1a4c4d73c9b48aa5b3cdae6e4c81f0bb3d1134eeb5a7100",
        integrationId: "cm6xmhn9h000gs601495fkkdx",
        organizationId: "org_map2JQEOco8U1ZYY",
        primaryBrandColor: "#010101",
      },
      aiChatSettings: {
        chatSubjectName: "Security",
        botAvatarSrcUrl: "https://security.video/images/favicon.png",
        getHelpCallToActions: [
          {
            name: "GitHub",
            url: "https://github.com/blakeblackshear/security",
            icon: {
              builtIn: "FaGithub",
            },
          },
        ],
        quickQuestions: [
          "How to configure and setup camera settings?",
          "How to setup notifications?",
          "Supported builtin detectors?",
          "How to restream video feed?",
          "How can I get sound or audio in my recordings?",
        ],
      },
    },
    prism: {
      additionalLanguages: ["bash", "json"],
    },
    languageTabs: [
      {
        highlight: "python",
        language: "python",
        logoClass: "python",
      },
      {
        highlight: "javascript",
        language: "nodejs",
        logoClass: "nodejs",
      },
      {
        highlight: "javascript",
        language: "javascript",
        logoClass: "javascript",
      },
      {
        highlight: "bash",
        language: "curl",
        logoClass: "curl",
      },
      {
        highlight: "rust",
        language: "rust",
        logoClass: "rust",
      },
    ],
    navbar: {
      title: "Security",
      logo: {
        alt: "Security",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: [
        {
          to: "/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://security.video",
          label: "Website",
          position: "right",
        },
        {
          href: "http://demo.security.video",
          label: "Demo",
          position: "right",
        },
        {
          type: 'localeDropdown',
          position: 'right',
          dropdownItemsAfter: [
            {
              label: '简体中文（社区翻译）',
              href: 'https://docs.security-cn.video',
            }
          ]
        },
        {
          href: 'https://github.com/blakeblackshear/security',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/blakeblackshear/security",
            },
            {
              label: "Discussions",
              href: "https://github.com/blakeblackshear/security/discussions",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Blake Blackshear`,
    },
  },
  plugins: [
    path.resolve(__dirname, "plugins", "raw-loader"),
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic", // configured for preset-classic
        config: {
          SecurityApi: {
            specPath: "static/security-api.yaml",
            outputDir: "docs/integrations/api",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
              sidebarCollapsible: true,
              sidebarCollapsed: true,
            },
            showSchemas: true,
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ] as PluginConfig[],
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          editUrl:
            "https://github.com/blakeblackshear/security/edit/master/docs/",
          sidebarCollapsible: false,
          docItemComponent: "@theme/ApiItem", // Derived from docusaurus-theme-openapi
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
};

export default async function createConfig() {
  return config;
}
