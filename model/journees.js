/* Modèle des journées — ticket bibliothèque des journées */
(function () {
  window.RoulementModel = {
    TYPES: {
      JOURNEE: 'JOURNEE',
      REPOS: 'RP',
      FAC: 'FAC',
      RM: 'RM',
      DISPO: 'DISPO'
    },

    createDay(data) {
      return {
        code: data.code || '',
        residence: data.residence || '',
        start: data.start || '',
        end: data.end || '',
        allowedDays: Array.isArray(data.allowedDays) ? data.allowedDays.slice() : [],
        rhrId: data.rhrId || null,
        rhrRole: data.rhrRole || null,
        rhrPlace: data.rhrPlace || ''
      };
    },

    validateDay(day) {
      return !!day && !!day.code;
    }
  };
})();
