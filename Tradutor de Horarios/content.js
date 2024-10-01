const days = {
  1: "domingo",
  2: "segunda-feira",
  3: "terça-feira",
  4: "quarta-feira",
  5: "quinta-feira",
  6: "sexta-feira",
  7: "sábado"
};

const shifts = {
  M: {
    shift: "manhã",
    times: ["7:30 - 8:20", "8:20 - 9:10", "9:30 - 10:20", "10:20 - 11:10", "11:10 - 12:00"]
  },
  T: {
    shift: "tarde",
    times: ["13:30 - 14:20", "14:20 - 15:10", "15:30 - 16:20", "16:20 - 17:10", "17:10 - 18:00", "18:00 - 18:50"]
  },
  N: {
    shift: "noite",
    times: ["19:00 - 19:50", "19:50 - 20:40", "21:00 - 21:50", "21:50 - 22:40"]
  }
};

function translateSchedule(code) {
  const daysPart = code.match(/\d+/g)[0];
  const shiftPart = code.match(/[MTN]/g)[0];
  const timesPart = code.match(/\d+$/g)[0].split('');

  const translatedDays = [...daysPart].map(d => days[d]).join(" e ");
  const translatedShift = shifts[shiftPart].shift;
  const translatedTimes = timesPart.map(t => shifts[shiftPart].times[t - 1]).join(", ");

  return `${translatedDays} de ${translatedShift} das ${translatedTimes}`;
}

function extractSubjectCodes() {
  const subjectCodes = {};
  document.querySelectorAll('#matriculas tbody tr').forEach(tr => {
    const codeElement = tr.querySelector('td.codigo');
    const nameElement = tr.querySelector('span.componente');
    const code = codeElement.innerText.trim();
    const name = nameElement.innerText.trim();
    subjectCodes[code] = name;
  });
  return subjectCodes;
}

function translateSchedulesInTable() {
  const matriculasTable = document.querySelector('#matriculas tbody');
  matriculasTable.querySelectorAll('td.horario').forEach(td => {
    const scheduleCode = td.innerText.trim();
    const scheduleParts = scheduleCode.split(' ');
    const translatedSchedules = scheduleParts.map(part => translateSchedule(part));
    td.innerText = translatedSchedules.join(', ');
  });
}

function replaceSubjectCodes(subjectCodes) {
  document.querySelectorAll('span[id^="horario"]').forEach(span => {
    const code = span.innerText.trim();
    span.innerText = subjectCodes[code];
  });
}

function translateContent() {
  const subjectCodes = extractSubjectCodes();
  translateSchedulesInTable();
  replaceSubjectCodes(subjectCodes);
}

window.addEventListener('load', translateContent);
