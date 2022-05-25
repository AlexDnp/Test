
const STATE_WORK_START = 0;
const STATE_WORK_NO_IZM = 1;
const STATE_WORK_READY = 2;
const STATE_WORK_PHASE_FAILURE = 3;
const STATE_WORK_OFF_U_IN_MAX = 4;
const STATE_WORK_OFF_U_IN_MIN = 5;
const STATE_WORK_LOW_U_IN = 6;
const STATE_WORK_OFF_U_OUT_MAX = 7;
const STATE_WORK_OFF_U_OUT_MIN = 8;
const STATE_WORK_OFF_I_MAX = 9;
const STATE_WORK_TIMEOUT = 10;
const STATE_WORK_RUN = 11;
const STATE_WORK_NO_SETTING = 12;
const STATE_WORK_SETTING = 13;
const STATE_WORK_OFF_THERMO = 14;
const STATE_WORK_OFF_MAN = 15;
const STATE_WORK_ERROR_BIG_KEY_CLOSE = 16;
const STATE_WORK_ERROR_BIG_KEY_OPEN = 17;
const STATE_WORK_ERROR_BIG_KEY_SELECT = 18;
const STATE_WORK_ERROR_SMALL_KEY_CLOSE = 19;
const STATE_WORK_ERROR_SMALL_KEY_OPEN = 20;
const STATE_WORK_ERROR_SMALL_KEY_SELECT = 21;
const STATE_WORK_ERROR_SYNCHRONIZATION = 22;
const STATE_WORK_ERROR = 23;


const State = {
    1: "Нет фазы ",//STATE_WORK_NO_IZM
    2: "Готов",//STATE_WORK_READY
    3: "Пропадание фазы ",//STATE_WORK_PHASE_FAILURE
    4: "Высокое вх.напр.",//STATE_WORK_OFF_U_IN_MAX
    5: "Низкое вх.напр. ",//STATE_WORK_OFF_U_IN_MIN
    6: "Низкое вх.напр. ",//STATE_WORK_LOW_U_IN
    7: "Высокое вых.напр.",//STATE_WORK_OFF_U_OUT_MAX
    8: "Низкое вых.напр. ",//STATE_WORK_OFF_U_OUT_MIN
    9: "Большой ток",//STATE_WORK_OFF_I_MAX

    11: "Включен", // STATE_WORK_RUN  
    12: "Нет настроек",//STATE_WORK_NO_SETTING

    14: "Перегрев",//STATE_WORK_OFF_THERMO

    16: "ключ закрыт",//STATE_WORK_KEY_CLOSE
    17: "ключ открыт",//STATE_WORK_KEY_OPEN
    18: "ключ не выбран",//STATE_WORK_KEY_NOSELECT
    19: "Ошибка синхронизации",//STATE_WORK_ERROR_SYNCHRONIZATION
}