import { PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { dailyMessageOpenUI } from "./dailyMessage";
import { setUIoverdue } from "./overdue";

export const getWeekdayString = (targetDay: Date): string => new Intl.DateTimeFormat((logseq.settings?.localizeOrEnglish as string) || "default", { weekday: "long" }).format(targetDay);
export const fromJournals = async (title: string) => {
  if (!logseq.settings) return;
  await logseq.Editor.restoreEditingCursor();
  //Load message box
  if (logseq.settings!.enableMessageBox === true) {
    if (logseq.settings!.toggleSunday === false ||
      logseq.settings!.toggleMonday === false ||
      logseq.settings!.toggleTuesday === false ||
      logseq.settings!.toggleWednesday === false ||
      logseq.settings!.toggleThursday === false ||
      logseq.settings!.toggleFriday === false ||
      logseq.settings!.toggleSaturday === false) return;
    const page = (await logseq.Editor.getPage(title)) as PageEntity | null;
    if (page && page!.journalDay) dailyMessageOpenUI(getDateInputJournalDay(String(page.journalDay)) as Date);
  }
  //Load overdue
  if (logseq.settings!.enableOverdueOnJournalTemplate === true) await setUIoverdue(false);
};//yyyymmdd形式をDateに変換
export const getDateInputJournalDay = (str: string): Date => new Date(
  Number(str.slice(0, 4)),
  Number(str.slice(4, 6)) - 1,
  Number(str.slice(6)),
  0, 0, 0, 0
);

export const closeUI = (key: string) => {
  const element = parent.document.getElementById(logseq.baseInfo.id + `--${key}`) as HTMLDivElement;
  if (element) element.remove();
};
//Dateをyyyymmdd形式の文字列に変換

export const getStringInputDate = (date: Date): string => `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}`;

