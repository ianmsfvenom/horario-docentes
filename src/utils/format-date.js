const { DateTime } = require('luxon');

function formatToISO8601(hour, minute) {
    return DateTime.utc().set({ hour, minute, second: 0, millisecond: 0 }).toISO();
}

module.exports = formatToISO8601;