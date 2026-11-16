const isColorSupported = process.env.NO_COLOR === undefined && process.env.FORCE_COLOR != "0" && (process.env.FORCE_COLOR !== undefined || (Boolean(process.stdout.isTTY) && process.env.TERM !== "dumb"));

const format = (open, close) => (text) => isColorSupported ? `${open}${text}${close}` : String(text);

export const ansi = {
    bold: format("\x1b[1m", "\x1b[22m"),
    dim: format("\x1b[2m", "\x1b[22m"),
    red: format("\x1b[31m", "\x1b[39m"),
    green: format("\x1b[32m", "\x1b[39m"),
    yellow: format("\x1b[33m", "\x1b[39m"),
    cyan: format("\x1b[36m", "\x1b[39m")
};