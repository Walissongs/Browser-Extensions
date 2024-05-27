// Função para traduzir os horários
function translateSchedule(code) {
  const days = {1: "domingo", 2: "segunda-feira", 3: "terça-feira", 4: "quarta-feira", 5: "quinta-feira", 6: "sexta-feira", 7: "sábado"};
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

  // Extrai partes do código
  let daysPart = code.match(/\d+/g)[0];
  let shiftPart = code.match(/[MTN]/g)[0];
  let timesPart = code.match(/\d+$/g)[0].split('');

  // Traduz os dias da semana
  let translatedDays = [...daysPart].map(d => days[d]).join(" e ");
  // Traduz o turno
  let translatedShift = shifts[shiftPart].shift;
  // Traduz os horários
  let translatedTimes = timesPart.map(t => shifts[shiftPart].times[t - 1]).join(", ");

  return `${translatedDays} de ${translatedShift} das ${translatedTimes}`;
}

// Função para traduzir as matérias e horários na página
function translateContent(subjectCodes) {
  // Traduz os códigos das matérias na tabela de horários
  const horarioTable = document.querySelector('#horario tbody');
  if (horarioTable) {
    horarioTable.querySelectorAll('span').forEach(span => {
      const code = span.innerText.trim();
      if (subjectCodes[code]) {
        span.innerText = subjectCodes[code];
      }
    });
  }

  // Traduz os códigos das matérias e horários na tabela de matrículas
  const matriculasTable = document.querySelector('#matriculas tbody');
  if (matriculasTable) {
    matriculasTable.querySelectorAll('td.codigo').forEach(td => {
      const code = td.innerText.trim();
      if (subjectCodes[code]) {
        td.innerText = subjectCodes[code];
      }
    });

    matriculasTable.querySelectorAll('td.horario').forEach(td => {
      const scheduleCode = td.innerText.trim();
      const scheduleParts = scheduleCode.split(' ');
      const translatedSchedules = scheduleParts.map(part => translateSchedule(part));
      td.innerText = translatedSchedules.join(', ');
    });
  }
}

// Carrega os códigos das matérias e traduz o conteúdo
chrome.storage.local.get('subjectCodes', function(data) {
  if (data.subjectCodes) {
    translateContent(data.subjectCodes);
  }
});
