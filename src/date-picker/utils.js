import { Utils } from '@wya/utils';
import DateUtil from '../utils/date';
/**
 * YMDHm: Month与Minutes冲突 -> M, m
 */
export const date2value = (v, format = 'YMDHm') => {
	if (!v) return;
	
	let target = {
		Y: v.getFullYear() + '',
		M: v.getMonth() * 1 + 1 + '',
		D: v.getDate() + '',
		H: v.getHours() + '',
		m: v.getMinutes() + '',
	};
	let typeArr = typeof format === 'string' ? format.split('') : format; // 'YMDHm'

	let result = typeArr.map(item => Utils.preZero(target[item]));

	return result;
};

export const value2date = (v = []) => {
	let result = [];
	for (let i = 0; i < 5 - v.length; i++) {
		result.push(false);
	}
	result = [...v, ...result];
	const target = {
		Y: result[0] || new Date().getFullYear(),
		M: result[1] || new Date().getMonth() * 1 + 1,
		D: result[2] || new Date().getDate(),
		H: result[3] || '00',
		m: result[4] || '00',
	};
	return new Date(
		target.Y, 
		target.M * 1 - 1, 
		target.D, 
		target.H, 
		target.m
	);
};

export const parseMode = (value) => {
	let mode;
	switch (value) {
		case 'datetime':
			mode = 'YMDHm';
			break;
		case 'date':
			mode = 'YMD';
			break;
		case 'time':
			mode = 'Hm';
			break;
		case 'yearmonth':
			mode = 'YM';
			break;
		case 'year':
			mode = 'Y';
			break;
		case 'month':
			mode = 'M';
			break;
		default:
			mode = value;
			break;
	}

	return mode;
};


/* -----------------------------  PC ------------------------------------------- */
export const toDate = (date) => {
	let _date = new Date(date);
	// IE patch start (#1422)
	if (isNaN(_date.getTime()) && typeof date === 'string') {
		_date = date.split('-').map(Number);
		_date[1] += 1;
		_date = new Date(..._date);
	}
	// IE patch end

	if (isNaN(_date.getTime())) return null;
	return _date;
};

export const formatDate = (date, format) => {
	date = toDate(date);
	if (!date) return '';
	return DateUtil.format(date, format || 'yyyy-MM-dd');
};

export const parseDate = (string, format) => {
	return DateUtil.parse(string, format || 'yyyy-MM-dd');
};

const DATE_FORMATTER = (value, format) => {
	return formatDate(value, format);
};
const DATE_PARSER = (text, format) => {
	return parseDate(text, format);
};
const RANGE_FORMATTER = (value, format, RANGE_SEPARATOR) => {
	if (Array.isArray(value) && value.length === 2) {
		const start = value[0];
		const end = value[1];

		if (start && end) {
			return formatDate(start, format) + RANGE_SEPARATOR + formatDate(end, format);
		}
	} else if (!Array.isArray(value) && value instanceof Date) {
		return formatDate(value, format);
	}
	return '';
};
const RANGE_PARSER = (text, format, RANGE_SEPARATOR) => {
	const array = Array.isArray(text) ? text : text.split(RANGE_SEPARATOR);
	if (array.length === 2) {
		const range1 = array[0];
		const range2 = array[1];

		return [
			range1 instanceof Date ? range1 : parseDate(range1, format),
			range2 instanceof Date ? range2 : parseDate(range2, format)
		];
	}
	return [];
};

export const TYPE_VALUE_RESOLVER_MAP = {
	default: {
		formatter(value) {
			if (!value) return '';
			return '' + value;
		},
		parser(text) {
			if (text === undefined || text === '') return null;
			return text;
		}
	},
	date: {
		formatter: DATE_FORMATTER,
		parser: DATE_PARSER
	},
	datetime: {
		formatter: DATE_FORMATTER,
		parser: DATE_PARSER
	},
	daterange: {
		formatter: RANGE_FORMATTER,
		parser: RANGE_PARSER
	},
	datetimerange: {
		formatter: RANGE_FORMATTER,
		parser: RANGE_PARSER
	},
	timerange: {
		formatter: RANGE_FORMATTER,
		parser: RANGE_PARSER
	},
	time: {
		formatter: DATE_FORMATTER,
		parser: DATE_PARSER
	},
	month: {
		formatter: DATE_FORMATTER,
		parser: DATE_PARSER
	},
	year: {
		formatter: DATE_FORMATTER,
		parser: DATE_PARSER
	},
	multiple: {
		formatter: (value, format) => {
			return value.filter(Boolean).map(date => formatDate(date, format)).join(',');
		},
		parser: (value, format) => {
			const values = typeof value === 'string' ? value.split(',') : value;
			return values.map(value => {
				if (value instanceof Date) return value;
				if (typeof value === 'string') value = value.trim();
				else if (typeof value !== 'number' && !value) value = '';
				return parseDate(value, format);
			});
		}
	},
	number: {
		formatter(value) {
			if (!value) return '';
			return '' + value;
		},
		parser(text) {
			let result = Number(text);

			if (!isNaN(text)) {
				return result;
			} else {
				return null;
			}
		}
	}
};

export const value2Array = (val) => {
	if (Array.isArray(val)) {
		return val;
	} else if (val) {
		return [val];
	} else {
		return [];
	}
};

/**
 * 日期数据是否是空的
 * @param {*} val 
 */
export const isEmpty = (val) => {
	return val === '' || val === undefined || val === null || val.length === 0;
};