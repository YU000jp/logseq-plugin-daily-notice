import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { PageEntity, SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
//import { setup as l10nSetup, t } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
//import ja from "./translations/ja.json";


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
  logseq.App.onTodayJournalCreated(async ({ title }) => {
    const page = await logseq.Editor.getPage(title) as PageEntity | null;
    if (page) {
      logseq.UI.showMsg(`Today Journal Created. ${page.journalDay}`, "info", { timeout: 5000 });
    }
  });

};/* end_main */



/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate: SettingSchemaDesc[] = [
{
  key: 'monday',
  type: 'string',
  inputAs: 'textarea',
  title: 'Monday',
  description: 'Message for Monday',
  default: "",
},
];


logseq.ready(main).catch(console.error);