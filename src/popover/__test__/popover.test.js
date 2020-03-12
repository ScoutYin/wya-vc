import { createVue, destroyVM, triggerEvent, triggerClick, wait } from '@tests/helper';
import Popover from '..';

describe('Popover', () => {
	let vm;

	afterEach(() => {
		destroyVM(vm);
	});

	it('basic', () => {
		expect(!!Popover).to.equal(true);
	});

	describe('trigger', () => {
		const createVM = (trigger, options = {}) => {
			return createVue({
				template: `
					<vc-popover 
						ref="popover"
						trigger="${trigger}"
						:alone="${options.alone}"
						content="This is content."
						portal-class-name="_popover-${trigger}"
					>
						<div ref="trigger" class="_trigger">trigger</div>
					</vc-popover>
				`,
				components: {
					'vc-popover': Popover
				}
			});
		};

		it('click', async () => {
			vm = createVM('click');
			let popover = document.querySelector('._popover-click');
			expect(popover).to.be.null;
			vm.$refs.trigger.click();
			await wait();
			popover = document.querySelector('._popover-click');
			expect(popover).to.be.exist;
			document.documentElement.click();
			await wait(0.5);
			popover = document.querySelector('._popover-click');
			expect(popover).to.be.null;
		});

		it('hover', async () => {
			vm = createVM('hover', { alone: true });
			let popover = document.querySelector('._popover-hover');
			expect(popover).to.be.null;
			triggerEvent(vm.$refs.popover.$el, 'mouseenter');
			await wait();
			popover = document.querySelector('._popover-hover');
			expect(popover).to.be.exist;
		});

		it('focus', async () => {
			vm = createVue({
				template: `
					<vc-popover 
						ref="popover"
						tag="input"
						trigger="focus"
						content="This is content."
						portal-class-name="_popover-focus"
					>
						
					</vc-popover>
				`,
				components: {
					'vc-popover': Popover
				}
			});
			let popover = document.querySelector('._popover-focus');
			expect(popover).to.be.null;
			vm.$refs.popover.$el.focus();
			await wait();
			popover = document.querySelector('._popover-focus');
			expect(popover).to.be.exist;

			vm.$refs.popover.$el.blur();
			await wait(1);
			popover = document.querySelector('._popover-focus');
			expect(popover).to.be.null;
		});
	});

	it('portal false', async () => {
		vm = createVue({
			template: `
				<vc-popover 
					ref="popover"
					:portal="false"
					trigger="click"
					portal-class-name="_popover-unportal"
				>
					<div ref="trigger" class="_trigger">trigger</div>
					<template #content>
						<span>This is content.</span>
					</template>
				</vc-popover>
			`,
			components: {
				'vc-popover': Popover
			}
		});

		let popover = vm.$el.querySelector('._popover-unportal');
		expect(popover).to.be.null;
		vm.$refs.trigger.click();
		await wait();
		popover = vm.$el.querySelector('._popover-unportal');
		expect(popover).to.be.exist;
	});

	it('getPopupContainer', async () => {
		vm = createVue({
			template: `
				<div>
					<div ref="container"></div>
					<vc-popover 
						ref="popover"
						:getPopupContainer="getPopupContainer"
						trigger="click"
						portal-class-name="_popover-container"
					>
						<div ref="trigger" class="_trigger" style="height: 30px;">trigger</div>
						<template #content>
							<span>This is content.</span>
						</template>
					</vc-popover>
				</div>
			`,
			components: {
				'vc-popover': Popover
			},
			methods: {
				getPopupContainer() {
					return this.$refs.container;
				}
			},
		});

		let popover = vm.$refs.container.querySelector('._popover-container');
		expect(popover).to.be.null;
		vm.$refs.trigger.click();
		await wait();
		popover = vm.$refs.container.querySelector('._popover-container');
		expect(popover).to.be.exist;
	});

	it('default slot error', async () => {
		vm = createVue({
			template: `
				<div>
					<vc-popover 
						ref="popover"
						trigger="click"
						portal-class-name="_popover-container"
					>
						<template #default>
							<div ref="trigger" class="_trigger">trigger</div>
						</template>
						<template #content>
							<span>This is content.</span>
						</template>
					</vc-popover>
				</div>
			`,
			components: {
				'vc-popover': Popover
			}
		});

		// let popover = vm.$refs.container.querySelector('._popover-container');
		// expect(popover).to.be.null;
		// vm.$refs.trigger.click();
		// await wait();
		// popover = vm.$refs.container.querySelector('._popover-container');
		// expect(popover).to.be.exist;
	});
});