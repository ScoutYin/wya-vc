import emitter from '../extends/mixins/emitter'; // 表单验证
import Icon from '../icon/index';
import Transition from '../transition/index';

export default {
	name: 'vc-input',
	mixins: [emitter],
	props: {
		type: {
			type: String,
			validator: v => /(text|password|tel)/.test(v),
			default: 'text'
		},
		value: {
			type: String | Number,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},
		maxlength: Number,
		disabled: {
			type: Boolean,
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		},
		name: {
			type: String
		},
		number: {
			type: Boolean,
			default: false
		},
		autofocus: {
			type: Boolean,
			default: false
		},
		spellcheck: {
			type: Boolean,
			default: false
		},
		autocomplete: {
			validator: v => /^(on|off)$/.test(v),
			default: 'off'
		},
		clearable: {
			type: Boolean,
			default: false
		},
		elementId: {
			type: String
		},
		search: {
			type: Boolean,
			default: false
		},
		enterTxt: {
			type: [Boolean, String],
			default: true
		}
	},
	data() {
		return {
			currentValue: this.value,
			isFocus: false,
			isOnComposition: false
		};
	},
	watch: {
		value: {
			immediate: false,
			handler(v, old) {
				this.currentValue = v;

				/**
				 * TODO: 验证是否会一开始就触发
				 */
				this.dispatch('vc-form-item', 'form-change', v);
			}
		}
	},
	computed: {
		classes() {
			return {
				'is-focus': this.isFocus
			};
		},
		hooks() {
			return {
				keyup: this.handleKeyup,
				keypress: this.handleKeypress,
				keydown: this.handleKeydown,
				focus: this.handleFocus,
				blur: this.handleBlur,
				compositionstart: this.handleComposition,
				compositionupdate: this.handleComposition,
				compositionend: this.handleComposition,
				input: this.handleInput,
				change: this.handleChange,
			};
		},
		binds() {
			return {
				id: this.elementId,
				autocomplete: this.autocomplete,
				spellcheck: this.spellcheck,
				type: this.type,
				placeholder: this.placeholder,
				disabled: this.disabled,
				maxlength: this.maxlength,
				readonly: this.readonly,
				name: this.name,
				// value: this.currentValue, // 频率高
				number: this.number,
				autofocus: this.autofocus,
			};
		}
	},
	mounted() {
	},
	methods: {
		handleKeydown(e) {
			this.$emit('keydown', e);
		},
		handleKeypress(e) {
			this.$emit('keypress', e);
		},
		handleKeyup(e) {
			if (e.keyCode == 13) {
				this.$emit('enter', e);
				this.search && this.$emit('search', this.currentValue);
			}
			this.$emit('keyup', e);
		},
		handleFocus(e) {
			this.isFocus = true;

			this.$emit('focus', e);
		},
		handleBlur(e) {
			this.isFocus = false;

			this.$emit('blur', e);
			this.dispatch('vc-form-item', 'form-blur', this.currentValue);
		},
		handleComposition(e) {
			if (e.type === 'compositionstart') {
				this.isOnComposition = true;
			}
			if (e.type === 'compositionend') {
				this.isOnComposition = false;
				this.handleInput(e);
			}
		},
		handleInput(e) {
			if (this.isOnComposition) return;

			let value = e.target.value;
			if (this.number && value !== '') {
				value = Number.isNaN(Number(value)) 
					? value 
					: Number(value);
			}
			this.$emit('input', value);
			this.$emit('change', e);
		},
		handleChange(e) {
			this.$emit('change', e);
		},
		handleClear() {
			const e = { target: { value: '' } };
			this.$emit('input', '');
			this.$emit('change', e);
		},
		handleSearch() {
			if (this.disabled) return false;

			this.$refs.input.focus();
			this.$emit('search', this.currentValue);
		},
		/**
		 * 外部方法扩展
		 */
		focus() {
			this.$refs.input.focus();
		},
		blur() {
			this.$refs.input.blur();
		},
		click() {
			this.$refs.input.click();
		}
	},
};