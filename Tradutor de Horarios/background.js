chrome.runtime.onInstalled.addListener(function() {
  fetch(chrome.runtime.getURL('materias.txt'))
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n');
      const subjectCodes = {};
      lines.forEach(line => {
        const [code, name] = line.split(' - ');
        if (code && name) {
          subjectCodes[code.trim()] = name.trim();
        }
      });
      chrome.storage.local.set({subjectCodes: subjectCodes});
    });
});
