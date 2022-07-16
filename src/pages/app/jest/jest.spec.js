import React from 'react'
import { shallow, mount } from 'enzyme';
// mount  测试生命周期
import TodoTextInput from './index';
import renderer from 'react-test-renderer'

function noop(){}

describe('event props value', () => {
  test('sets the text prop as value', () => {
    const text = '1234'
    const wrapper = shallow(<TodoTextInput text={text} onSave={noop} />)
    expect(wrapper.prop('value')).toBe(text); // wrapper.prop('value') 获取自身本身的值 toBe ==>  === 严等
  });
  test('uses the placeholder prop', () => {
    const placeholder = 'placeholder'
    const wrapper = shallow(<TodoTextInput placeholder={placeholder} onSave={noop} />)
    expect(wrapper.prop('placeholder')).toBe(placeholder)
  });
  test('applies the right class names', () => {
    const wrapper = shallow(<TodoTextInput editing newTodo onSave={noop} />)
    expect(wrapper.hasClass('edit new-todo')).toBe(true)
  });
  test('fires onSave on enter', () => {
    const onSave = jest.fn(); // 返回一个新的未使用的mock函数。可选择采用模拟实现。
    const value = 'value';
    const wrapper = shallow(<TodoTextInput onSave={onSave} />)
    wrapper.simulate('keydown', { target: { value }, which: 13 }) // 模拟dom事件
    // expect(wrapper.prop('value')).toBe('');
    expect(onSave).toHaveBeenCalledWith(value); // 参数的值调用的是否是一样
  });
  test('does not fire onSave on key down', () => {
    const onSave = jest.fn()
    const wrapper = shallow(<TodoTextInput onSave={onSave} />)
    wrapper.simulate('keydown', { target: { value: '' } })
    expect(onSave).not.toBeCalled() //.not，它对跟在自己后方的函数进行反向断言； toBeCalled 调用
  });
  test('clears the value after save if new', () => {
    const value = 'value'
    const wrapper = shallow(<TodoTextInput newTodo onSave={noop} />)
    wrapper.simulate('keydown', { target: { value }, which: 13 })
    expect(wrapper.prop('value')).toBe('')
  });
  test('updates the text on change', () => {
    const value = 'value'
    const wrapper = shallow(<TodoTextInput onSave={noop} />)
    wrapper.simulate('change', { target: { value } })
    expect(wrapper.prop('value')).toBe(value);
  });
  test('fires onSave on blur if not new', () => {
    const onSave = jest.fn()
    const value = 'value'
    const wrapper = shallow(<TodoTextInput  onSave={onSave} />)
    wrapper.simulate('blur', { target: { value } })
    expect(onSave).toHaveBeenCalledWith(value) // 使用的值是否一样
  })
  test('does not fire onSave on blur if new', () => {
    const onSave = jest.fn()
    const wrapper = shallow(
    <TodoTextInput newTodo onSave={onSave} />)
    wrapper.simulate('blur')
    expect(onSave).not.toBeCalled()
  }) 
})

// 执行 npm test -- -u 可以自动更新快照。
describe('React 组件树快照测试', () => {
  test('snapshots are awesome', () => {
    const component = renderer.create(<TodoTextInput editing onSave={() => {}} />) // 导入的 renderer 渲染组件
    const tree = component.toJSON() // 序列化组件
    expect(tree).toMatchSnapshot() //快照对比
  })
})