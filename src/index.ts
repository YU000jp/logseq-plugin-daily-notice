import "@logseq/libs"; //https://plugins-doc.logseq.com/
//import { setup as l10nSetup, t } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
//import ja from "./translations/ja.json";
import { fromJournals } from "./lib";
import { setUIoverdue } from "./overdue";
import { dailyMessageOpenUI } from "./dailyMessage";
import { settingsTemplate } from "./settings";
import { onSettingsChangedForDayOfWeekMessage } from "./dailyMessage";

/* main */
const main = () => {
  // (async () => {
  //   try {
  //     await l10nSetup({ builtinTranslations: { ja } });
  //   } finally {
  /* user settings */
  logseq.useSettingsSchema(settingsTemplate);
  if (!logseq.settings) setTimeout(() => logseq.showSettingsUI(), 300);
  //   }
  // })();

  logseq.App.onTodayJournalCreated(async ({ title }) => await fromJournals(title));

  if (logseq.settings!.enableOverdueLogseqLoaded === true) setTimeout(() => setUIoverdue(false), 300);
  if (logseq.settings!.enableMessageBoxLogseqLoaded === true) setTimeout(() => dailyMessageOpenUI(new Date()), 300);

  
  //for settingUI
  logseq.provideStyle(`
    div#${logseq.baseInfo.id}--overdue span.block-marker {
      cursor: pointer;
      text-decoration: underline;
      padding: 0 0.8em;
      border: 1px solid;
      margin-right: 0.8em;
    }
    div#${logseq.baseInfo.id}--overdue li {
      margin-bottom: 0.5em;
    }
    /* require Logseq v0.9.10 or later */
    body:has(div#root main.ls-right-sidebar-open) div:is(#${logseq.baseInfo.id}--overdue,#${logseq.baseInfo.id}--messageBox) {
      display: none;
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] textarea.form-input {
      height: 12em;
      font-size: unset;
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="backgroundColor"] select option[value="var(--ls-primary-background-color)"] {
      background:var(--ls-primary-background-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="backgroundColor"] select option[value="var(--ls-secondary-background-color)"] {
      background:var(--ls-secondary-background-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="backgroundColor"] select option[value="var(--ls-tertiary-background-color)"] {
      background:var(--ls-tertiary-background-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="backgroundColor"] select option[value="var(--ls-quaternary-background-color)"] {
      background:var(--ls-quaternary-background-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="backgroundColor"] select option[value="var(--ls-table-tr-even-background-color)"] {
      background:var(--ls-table-tr-even-background-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="backgroundColor"] select option[value="var(--ls-block-properties-background-color)"] {
      background:var(--ls-block-properties-background-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="backgroundColor"] select option[value="var(--ls-page-properties-background-color)"] {
      color:var(--ls-page-properties-background-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="fontColor"] select option[value="var(--ls-primary-text-color)"] {
      color:var(--ls-primary-text-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="fontColor"] select option[value="var(--ls-secondary-text-color)"] {
      color:var(--ls-secondary-text-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="fontColor"] select option[value="var(--ls-title-text-color)"] {
      color:var(--ls-title-text-color)
    }
    div#root main div[data-id="${logseq.baseInfo.id}"] div[data-key="fontColor"] select option[value="var(--ls-link-text-color)"] {
      color:var(--ls-link-text-color)
    }
  `);

  //If change settings, show message box
  onSettingsChangedForDayOfWeekMessage();

  // external button on toolbar
  logseq.App.registerUIItem('toolbar', {
    key: 'openOverdue',
    template: `<div><a class="button icon" data-on-click="overdueFromToolbar" title="open overdue task monitor" style="font-size:20px">⏳</a></div>`,
  });
  logseq.App.registerUIItem('toolbar', {
    key: 'openMessageBox',
    template: `<div><a class="button icon" data-on-click="messageBoxFromToolbar" title="open weekday message box" style="font-size:20px">💬</a></div>`,
  });

  logseq.provideModel({
    overdueFromToolbar: () => setUIoverdue(false),
    messageBoxFromToolbar: () => dailyMessageOpenUI(new Date()),
  });


}; /* end_main */



logseq.ready(main).catch(console.error);