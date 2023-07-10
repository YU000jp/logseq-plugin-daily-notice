import "@logseq/libs"; //https://plugins-doc.logseq.com/
import { BlockEntity, LSPluginBaseInfo, PageEntity, SettingSchemaDesc, } from "@logseq/libs/dist/LSPlugin.user";
//import { setup as l10nSetup, t } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
//import ja from "./translations/ja.json";
import { subDays, subWeeks } from 'date-fns';

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
  logseq.onSettingsChanged((newSet: LSPluginBaseInfo["settings"], oldSet: LSPluginBaseInfo["settings"]) => {
    if (newSet.width !== oldSet.width || newSet.height !== oldSet.height) {
      setUImessageBox(
        getWeekdayString(new Date()),
        "Change size of message box",
        true,
        true,
      );
    } else if (newSet.backgroundColor !== oldSet.backgroundColor) {
      setUImessageBox(
        getWeekdayString(new Date()),
        "Change background color of message box",
        true,
        true,
      );
    } else if (newSet.fontColor !== oldSet.fontColor) {
      setUImessageBox(
        getWeekdayString(new Date()),
        "Change font color of message box",
        true,
        true,
      );
    } else if (newSet.localizeOrEnglish !== oldSet.localizeOrEnglish) {
      setUImessageBox(
        getWeekdayString(new Date()),
        "Change language of message box",
        true,
        true,
      );
    } else if (newSet.messageBoxAlignment !== oldSet.messageBoxAlignment) {
      try {
        const element = parent.document.getElementById(logseq.baseInfo.id + "--messageBox") as HTMLDivElement;
        if (element) element.remove();
      } finally {
        setUImessageBox(
          getWeekdayString(new Date()),
          "Change position of message box",
          true,
          true,
        );
      }
    }
    if (oldSet.toggleMonday === false && newSet.toggleMonday === true) {
      const monday = new Date();
      monday.setDate(monday.getDate() - monday.getDay() + 1);
      setUImessageBox(
        getWeekdayString(monday),
        newSet.monday,
        true,
        true,
      );
    } else if (oldSet.toggleTuesday === false && newSet.toggleTuesday === true) {
      const tuesday = new Date();
      tuesday.setDate(tuesday.getDate() - tuesday.getDay() + 2);
      setUImessageBox(
        getWeekdayString(tuesday),
        newSet.tuesday,
        true,
        true,
      );
    } else if (oldSet.toggleWednesday === false && newSet.toggleWednesday === true) {
      const wednesday = new Date();
      wednesday.setDate(wednesday.getDate() - wednesday.getDay() + 3);
      setUImessageBox(getWeekdayString(wednesday),
        newSet.wednesday,
        true,
        true,
      );
    } else if (oldSet.toggleThursday === false && newSet.toggleThursday === true) {
      const thursday = new Date();
      thursday.setDate(thursday.getDate() - thursday.getDay() + 4);
      setUImessageBox(getWeekdayString(thursday),
        newSet.thursday,
        true,
        true,
      );
    } else if (oldSet.toggleFriday === false && newSet.toggleFriday === true) {
      const friday = new Date();
      friday.setDate(friday.getDate() - friday.getDay() + 5);
      setUImessageBox(getWeekdayString(friday),
        newSet.friday,
        true,
        true,
      );
    } else if (oldSet.toggleSaturday === false && newSet.toggleSaturday === true) {
      const saturday = new Date();
      saturday.setDate(saturday.getDate() - saturday.getDay() + 6);
      setUImessageBox(getWeekdayString(saturday),
        newSet.saturday,
        true,
        true,
      );
    } else if (oldSet.toggleSunday === false && newSet.toggleSunday === true) {
      const sunday = new Date();
      sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
      setUImessageBox(getWeekdayString(sunday),
        newSet.sunday,
        true,
        true,
      );
    }
  }
  );

  // external button on toolbar
  logseq.App.registerUIItem('toolbar', {
    key: 'overdue',
    template: `<div data-rect><a class="button icon" data-on-click="overdueFromToolbar" title="open overdue task monitor" style="font-size:20px">⏳</a></div>`,
  });

  logseq.provideModel({
    overdueFromToolbar: () => {
      if (logseq.settings!.enableOverdue === true) setUIoverdue(false, true);
    },
  });

}; /* end_main */

const getWeekdayString = (targetDay: Date): string => new Intl.DateTimeFormat((logseq.settings?.localizeOrEnglish as string) || "default", { weekday: "long" }).format(targetDay);

const fromJournals = async (title: string) => {
  if (!logseq.settings) return;
  await logseq.Editor.restoreEditingCursor();
  //Load message box
  if (logseq.settings!.enableMessageBox === true) {
    if (
      logseq.settings!.toggleSunday === false ||
      logseq.settings!.toggleMonday === false ||
      logseq.settings!.toggleTuesday === false ||
      logseq.settings!.toggleWednesday === false ||
      logseq.settings!.toggleThursday === false ||
      logseq.settings!.toggleFriday === false ||
      logseq.settings!.toggleSaturday === false
    ) return;
    const page = (await logseq.Editor.getPage(title)) as PageEntity | null;
    if (page && page!.journalDay) openUIdayOfWeek(getJournalDayDate(String(page.journalDay)) as Date);
  }
  //Load overdue
  if (logseq.settings!.enableOverdue === true) await setUIoverdue(false, true);
};

//Overdue
const setUIoverdue = async (demo: boolean, timeoutCancel?: boolean) => {
  let print: string = "";
  //yyyymmdd形式で今日の日付を作成
  const today = new Date();

  const query = String.raw`
  [:find (pull ?b [*])
  :where
  [?b :block/marker ?marker]
  [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
  [?b :block/page ?p]
  (or
    (or
      [?b :block/scheduled ?d]
      [?b :block/deadline ?d]
    )
  )
  [(<= ?d ${formatToStringJournalDayStyle(subDays(today, 1))})]
  [(> ?d ${formatToStringJournalDayStyle(subWeeks(today, 4))})]
]
`;
  const res = await logseq.DB.datascriptQuery(query);
  if (!res || res.length === 0) {
    logseq.UI.showMsg("No find overdue tasks", "info", { timeout: 5000 });
    return;
  }
  //console.log(res);
  if (res) {
    print += `<ul title="">`;
    let itemList: string[] = [];
    let linkList: string[] = [];
    for (const [item] of res) {
      //「item.marker 」に一致するものをitem.contentから取り除く
      let content = item.content;
      if (item.marker) content = content.replace(item.marker + " ", "");
      //「:LOGBOOK:」とそれ以降を取り除く
      const propertyLogbook = content.indexOf(":LOGBOOK:");
      if (propertyLogbook !== -1) content = content.slice(0, propertyLogbook);
      // 「id::」とそれ以降を取り除く
      const propertyId = content.indexOf("id::");
      if (propertyId !== -1) content = content.slice(0, propertyId);
      // 「icon::」とそれ以降を取り除く
      const propertyIcon = content.indexOf("icon::");
      if (propertyIcon !== -1) content = content.slice(0, propertyIcon);
      // 「SCHEDULED:」を「<br/><>SCHEDULED:」に置き換える
      content = content.replace("SCHEDULED:", "<br/><span  class='timestamp-label'>SCHEDULED:</span>");
      // 「DEADLINE:」を「<br/><span>DEADLINE:」に置き換える
      content = content.replace("DEADLINE:", "<br/><span  class='timestamp-label'>DEADLINE:</span>");
      // [[タイトル]]のように[[と]]で囲まれた文字列が複数ある場合、[[と]]を削除し代わりに<a href="#/page/タイトル">リンクを追加、その文字列だけを全体からいくつか取り出す
      const propertyLink = content.match(/\[\[(.*?)\]\]/g);
      if (propertyLink) {
        for (const link of propertyLink) {
          const linkTitle = link.replace(/\[\[(.*?)\]\]/g, "$1");
          const page = await logseq.Editor.getPage(linkTitle) as PageEntity | null;
          if (!page) continue;
          content = content.replace(link, `<a title="${linkTitle}" id="overdueLink--${page.uuid}">${linkTitle}</a>`);//TODO: リンクにする (<a>タグでの直リンクはよくない？)
          linkList.push(page.uuid);
        }
      }

      print += `<li><span class="block-marker ${item.marker}" id="overdue--${item.uuid}" title="Open in right sidebar">${item.marker}</span><span class="overDueContent">${content}</span>`;
      //item.scheduledをyyyy/mm/dd EEE形式に変換し、前後に<と>をつける
      print += `</li>`;
      itemList.push(item.uuid);
    };
    print += `</ul>`;
    const show = (demo: boolean) => {
      logseq.provideUI({
        key: "overdue",
        reset: true,
        template: `
      <div style="padding:0.5em">
      ${print}
      </div>
    `,
        style: {
          padding: "0.5em",
          right: "2vw",
          left: "unset",
          top: "unset",
          bottom: "1vw",
          width: `550px`,
          height: `500px`,
          backgroundColor: "var(--ls-primary-background-color)",
          color: "var(--ls-primary-text-color)",
          boxShadow: "1px 2px 5px var(--ls-secondary-background-color)",
          zIndex: demo === true ? "var(--ls-z-index-level-5)" : undefined,
        },
        attrs: {
          title: "Overdue task (4 weeks)",
        },
      });
    };
    timeoutCancel === true ? show(demo) : setTimeout(() => show(demo), 1500);
    setTimeout(() => {
      itemList.forEach((uuid) => {
        const element = parent.document.getElementById(`overdue--${uuid}`) as HTMLSpanElement;
        if (element) element.onclick = async () => {
          const block = (await logseq.Editor.getBlock(uuid)) as BlockEntity | null;
          if (block) {
            logseq.Editor.openInRightSidebar(uuid);
          } else {
            logseq.UI.showMsg("Block not found", "warning", { timeout: 5000 });
          }
        };
      });
      linkList.forEach((uuid) => {
        const element = parent.document.getElementById(`overdueLink--${uuid}`) as HTMLAnchorElement;
        if (element) element.onclick = async () => { //{ shiftKey }
          const page = (await logseq.Editor.getPage(uuid)) as PageEntity | null;
          if (page) {
            logseq.Editor.openInRightSidebar(uuid);
          } else {
            logseq.UI.showMsg("Page not found", "warning", { timeout: 5000 });
          }
        };
      });
    }, timeoutCancel === true ? 300 : 1800);
  }
};

const openUIdayOfWeek = (targetDay: Date, demo?: number) => {
  //曜日を確認
  const dayOfWeek: number = demo || demo === 0 ? demo : targetDay.getDay();
  //曜日に応じてメッセージを表示
  switch (dayOfWeek) {
    case 0:
      if (logseq.settings!.toggleSunday)
        setUImessageBox(
          getWeekdayString(targetDay),
          logseq.settings!.sunday,
          false,
          false,
        );
      break;
    case 1:
      if (logseq.settings!.toggleMonday)
        setUImessageBox(
          getWeekdayString(targetDay),
          logseq.settings!.monday,
          false,
          false,
        );
      break;
    case 2:
      if (logseq.settings!.toggleTuesday)
        setUImessageBox(
          getWeekdayString(targetDay),
          logseq.settings!.tuesday,
          false,
          false,
        );
      break;
    case 3:
      if (logseq.settings!.toggleWednesday)
        setUImessageBox(
          getWeekdayString(targetDay),
          logseq.settings!.wednesday,
          false,
          false,
        );
      break;
    case 4:
      if (logseq.settings!.toggleThursday)
        setUImessageBox(
          getWeekdayString(targetDay),
          logseq.settings!.thursday,
          false,
          false,
        );
      break;
    case 5:
      if (logseq.settings!.toggleFriday)
        setUImessageBox(
          getWeekdayString(targetDay),
          logseq.settings!.friday,
          false,
          false,
        );
      break;
    case 6:
      if (logseq.settings!.toggleSaturday)
        setUImessageBox(
          getWeekdayString(targetDay),
          logseq.settings!.saturday,
          false,
          false
        );
      break;
  }
};

const setUImessageBox = (title: string, print: string, timeoutCancel: boolean, demo: boolean) => {
  if (print === undefined) return;
  const width: number = calculateRangeBarForSettingUI(300, 900, logseq.settings?.width as number);
  const height: number = calculateRangeBarForSettingUI(300, 900, logseq.settings?.height as number);
  const backgroundColor = (logseq.settings?.backgroundColor as string) || "var(--ls-primary-background-color)";
  const color = (logseq.settings?.fontColor as string) || "var(--ls-primary-text-color)";
  let left = "unset";
  let top = "unset";
  let right = "unset";
  let bottom = "unset";
  switch (logseq.settings!.messageBoxAlignment as string) {
    case "right":
      right = "2vw";
      top = "calc(2vh + 50px)";
      break;
    case "center":
      top = `2vw`;
      left = `calc(50vw-(${width}/2)px)`;
      break;
    case "bottom":
      left = `calc(50vw-(${width}/2)px)`;
      bottom = "2vw";
      break;
  }
  const show = (demo: boolean) => {
    logseq.provideUI({
      key: "messageBox",
      reset: true,
      replace: true,
      template: `
    <div style="padding:0.5em">
    ${print}
    </div>
  `,
      style: {
        padding: "0.5em",
        left,
        right,
        top,
        bottom,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor,
        color,
        boxShadow: "1px 2px 5px var(--ls-secondary-background-color)",
        zIndex: demo === true ? "var(--ls-z-index-level-5)" : undefined,
      },
      attrs: {
        title,
      },
    });
    if (logseq.settings!.enableMessageBoxTimeout === true) setTimeout(() => {
      const element = parent.document.getElementById(logseq.baseInfo.id + "--messageBox") as HTMLDivElement;
      let closeCancel: boolean = false;
      element.onclick = () => closeCancel = true;
      element.onclose = () => closeCancel = true;
      setTimeout(() => {
        if (closeCancel === false && element) element.style.borderColor = "red";
      }, logseq.settings!.messageBoxTimeout as number - 2000);
      setTimeout(() => {
        if (closeCancel === false && element) element.remove();
      }, logseq.settings!.messageBoxTimeout as number || 6000);
    }, 100);

  };
  timeoutCancel === true ? show(demo) : setTimeout(() => show(demo), 1500);
};

const getJournalDayDate = (str: string): Date => new Date(
  Number(str.slice(0, 4)), //year
  Number(str.slice(4, 6)) - 1, //month 0-11
  Number(str.slice(6)), //day
  0, 0, 0, 0
);


const formatToStringJournalDayStyle = (date: Date): string => `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}`;


//for setting UI
function calculateRangeBarForSettingUI(min: number, max: number, value: number): number {
  if (value < 1) value = 1;
  return (value * (max - min) / 100) + min;
}

/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate: SettingSchemaDesc[] = [
  {
    //messageBox
    key: "enableMessageBox",
    type: "boolean",
    title: "Enable message box",
    description: "Show message box when today journal is created",
    default: true,
  },
  {//message box alignment
    key: "messageBoxAlignment",
    type: "enum",
    title: "Message box alignment",
    enumChoices: ["center", "right", "bottom"],
    default: "center",
    description: "default: center",
  },
  {
    //width: 500px
    key: "width",
    type: "number",
    title: "Width of message box",
    description: "300 < 600 < 900 [px]",
    default: 40,
    inputAs: "range",
  },
  {
    //height: 500px
    key: "height",
    type: "number",
    title: "Height of message box",
    description: "300 < 600 < 900 [px]",
    default: 25,
    inputAs: "range",
  },
  {//enable close timeout
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
    title:
      "For weekday of the message box title, select localize (your language) or English",
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
    description:
      "To view the modified content, toggle it off and then on again.",
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
    description:
      "To view the modified content, toggle it off and then on again.",
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
    description:
      "To view the modified content, toggle it off and then on again.",
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
    description:
      "To view the modified content, toggle it off and then on again.",
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
    description:
      "To view the modified content, toggle it off and then on again.",
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
    description:
      "To view the modified content, toggle it off and then on again.",
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
    description:
      "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {//overdue
    key: "enableOverdue",
    type: "boolean",
    title: "Enable Overdue",
    description: "Show overdue tasks when today journal is created",
    default: false,
  },
];

logseq.ready(main).catch(console.error);
