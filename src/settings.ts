import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

//for setting UI
export const calculateRangeBarForSettingUI = (min: number, max: number, value: number): number => {
  if (value < 1) value = 1;
  return (value * (max - min) / 100) + min;
};
/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate: SettingSchemaDesc[] = [
  {
    //messageBox
    key: "enableMessageBox",
    type: "boolean",
    title: "Show message box when today journal is created",
    description: "",
    default: true,
  },
  {
    //messageBox Logseq loaded
    key: "enableMessageBoxLogseqLoaded",
    type: "boolean",
    title: "Show message box when Logseq loaded",
    description: "",
    default: false,
  },
  {
    //width: 500px
    key: "width",
    type: "number",
    title: "Width of message box",
    description: "300 < 600 < 900 [px]",
    default: 30,
    inputAs: "range",
  },
  {
    //height: 500px
    key: "height",
    type: "number",
    title: "Height of message box",
    description: "300 < 600 < 900 [px]",
    default: 20,
    inputAs: "range",
  },
  {
    key: "enableMessageBoxTimeout",
    type: "boolean",
    title: "Enable close message box timeout",
    description: "",
    default: true,
  },
  {
    //close timeout
    key: "messageBoxTimeout",
    type: "enum",
    title: "Close message box timeout [ms]",
    enumChoices: ["8000", "9000", "10000", "12000", "14000", "16000", "18000", "20000"],
    description: "default: 10000",
    default: "10000",
  },
  {
    //background color
    key: "backgroundColor",
    type: "enum",
    title: "Background color (from theme)",
    enumChoices: [
      "var(--ls-primary-background-color)",
      "var(--ls-secondary-background-color)",
      "var(--ls-tertiary-background-color)",
      "var(--ls-quaternary-background-color)",
      "var(--ls-table-tr-even-background-color)",
      "var(--ls-block-properties-background-color)",
      "var(--ls-page-properties-background-color)",
    ],
    description: "default: var(--ls-primary-background-color)",
    default: "var(--ls-primary-background-color)",
  },

  {
    //color
    key: "fontColor",
    type: "enum",
    title: "Font Color (from theme)",
    enumChoices: [
      "var(--ls-primary-text-color)",
      "var(--ls-secondary-text-color)",
      "var(--ls-title-text-color)",
      "var(--ls-link-text-color)",
    ],
    description: "default: var(--ls-primary-text-color)",
    default: "var(--ls-primary-text-color)",
  },
  {
    key: "localizeOrEnglish",
    type: "enum",
    title: "For weekday of the message box title, select localize (your language) or English",
    enumChoices: ["default", "en"],
    description: "",
    default: "default",
  },
  {
    key: "toggleMonday",
    type: "boolean",
    title: "Show Monday Message",
    description: "",
    default: false,
  },
  {
    key: "monday",
    type: "string",
    inputAs: "textarea",
    title: "Message for Monday (Supports HTML instead of markdown)",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleTuesday",
    type: "boolean",
    title: "Show Tuesday Message",
    description: "",
    default: false,
  },
  {
    key: "tuesday",
    type: "string",
    inputAs: "textarea",
    title: "Message for Tuesday (Supports HTML instead of markdown)",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleWednesday",
    type: "boolean",
    title: "Show Wednesday Message",
    description: "",
    default: false,
  },
  {
    key: "wednesday",
    type: "string",
    inputAs: "textarea",
    title: "Message for Wednesday (Supports HTML instead of markdown)",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleThursday",
    type: "boolean",
    title: "Show Thursday Message",
    description: "",
    default: false,
  },
  {
    key: "thursday",
    type: "string",
    inputAs: "textarea",
    title: "Message for Thursday (Supports HTML instead of markdown)",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleFriday",
    type: "boolean",
    title: "Show Friday Message",
    description: "",
    default: false,
  },
  {
    key: "friday",
    type: "string",
    inputAs: "textarea",
    title: "Message for Friday (Supports HTML instead of markdown)",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleSaturday",
    type: "boolean",
    title: "Show Saturday Message",
    description: "",
    default: false,
  },
  {
    key: "saturday",
    type: "string",
    inputAs: "textarea",
    title: "Message for Saturday (Supports HTML instead of markdown)",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleSunday",
    type: "boolean",
    title: "Show Sunday Message",
    description: "",
    default: false,
  },
  {
    key: "sunday",
    type: "string",
    inputAs: "textarea",
    title: "Message for Sunday (Supports HTML instead of markdown)",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "enableOverdueOnJournalTemplate",
    type: "boolean",
    title: "Show overdue tasks when journal template is loaded",
    description: "",
    default: true,
  },
  {
    key: "enableOverdueLogseqLoaded",
    type: "boolean",
    title: "Show overdue tasks when Logseq is loaded",
    description: "",
    default: false,
  }
];
