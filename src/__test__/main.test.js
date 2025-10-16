import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handleButtonClick, trackMousePosition, setupEventDelegation } from '../main'

describe('handleButtonClick', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('should add click event listener to button', () => {
    document.body.innerHTML = '<button id="testButton">Click me</button>'
    const consoleSpy = vi.spyOn(console, 'log')

    handleButtonClick('testButton', 'Button clicked!')
    const button = document.getElementById('testButton')
    button.click()

    expect(consoleSpy).toHaveBeenCalledWith('Button clicked!')
    consoleSpy.mockRestore()
  })

  it('should log message multiple times', () => {
    document.body.innerHTML = '<button id="btn">Multi</button>'
    const consoleSpy = vi.spyOn(console, 'log')

    handleButtonClick('btn', 'Test message')
    const button = document.getElementById('btn')
    button.click()
    button.click()

    expect(consoleSpy).toHaveBeenCalledTimes(2)
    consoleSpy.mockRestore()
  })

  it('should work with different buttons', () => {
    document.body.innerHTML = `
      <button id="btn1">Button 1</button>
      <button id="btn2">Button 2</button>
    `
    const consoleSpy = vi.spyOn(console, 'log')

    handleButtonClick('btn1', 'Message 1')
    handleButtonClick('btn2', 'Message 2')
    document.getElementById('btn1').click()
    document.getElementById('btn2').click()

    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Message 1')
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Message 2')
    consoleSpy.mockRestore()
  })

  it('should not throw error if button does not exist', () => {
    expect(() => {
      handleButtonClick('nonExistentButton', 'Message')
    }).not.toThrow()
  })

  it('should handle null buttonId', () => {
    expect(() => {
      handleButtonClick(null, 'Message')
    }).not.toThrow()
  })

  it('should handle empty message', () => {
    document.body.innerHTML = '<button id="btn">Test</button>'
    const consoleSpy = vi.spyOn(console, 'log')

    handleButtonClick('btn', '')
    document.getElementById('btn').click()

    expect(consoleSpy).toHaveBeenCalledWith('')
    consoleSpy.mockRestore()
  })
})

describe('trackMousePosition', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('should log mouse position', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    trackMousePosition()
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    })
    document.dispatchEvent(event)

    expect(consoleSpy).toHaveBeenCalledWith('Mouse X: 100, Mouse Y: 200')
    consoleSpy.mockRestore()
  })

  it('should track multiple movements', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    trackMousePosition()

    const event1 = new MouseEvent('mousemove', { clientX: 10, clientY: 20 })
    const event2 = new MouseEvent('mousemove', { clientX: 50, clientY: 60 })

    document.dispatchEvent(event1)
    document.dispatchEvent(event2)

    expect(consoleSpy).toHaveBeenCalledWith('Mouse X: 10, Mouse Y: 20')
    expect(consoleSpy).toHaveBeenCalledWith('Mouse X: 50, Mouse Y: 60')
    consoleSpy.mockRestore()
  })

  it('should handle zero coordinates', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    trackMousePosition()
    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 0 })
    document.dispatchEvent(event)

    expect(consoleSpy).toHaveBeenCalledWith('Mouse X: 0, Mouse Y: 0')
    consoleSpy.mockRestore()
  })

  it('should handle negative coordinates', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    trackMousePosition()
    const event = new MouseEvent('mousemove', { clientX: -10, clientY: -20 })
    document.dispatchEvent(event)

    expect(consoleSpy).toHaveBeenCalledWith('Mouse X: -10, Mouse Y: -20')
    consoleSpy.mockRestore()
  })
})

describe('setupEventDelegation', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('should log item text when clicked', () => {
    document.body.innerHTML = `
      <ul id="testList">
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `
    const consoleSpy = vi.spyOn(console, 'log')

    setupEventDelegation('#testList')
    const firstItem = document.querySelector('#testList li:first-child')
    firstItem.click()

    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Item 1')
    consoleSpy.mockRestore()
  })

  it('should handle multiple list items', () => {
    document.body.innerHTML = `
      <ul class="myList">
        <li>First</li>
        <li>Second</li>
      </ul>
    `
    const consoleSpy = vi.spyOn(console, 'log')

    setupEventDelegation('.myList')
    const items = document.querySelectorAll('.myList li')
    items[0].click()
    items[1].click()

    expect(consoleSpy).toHaveBeenCalledTimes(2)
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Item clicked: First')
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Item clicked: Second')
    consoleSpy.mockRestore()
  })

  it('should work with ordered lists', () => {
    document.body.innerHTML = `
      <ol id="orderedList">
        <li>Step 1</li>
      </ol>
    `
    const consoleSpy = vi.spyOn(console, 'log')

    setupEventDelegation('#orderedList')
    document.querySelector('#orderedList li').click()

    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Step 1')
    consoleSpy.mockRestore()
  })

  it('should trim whitespace', () => {
    document.body.innerHTML = `
      <ul id="list">
        <li>   Trimmed   </li>
      </ul>
    `
    const consoleSpy = vi.spyOn(console, 'log')

    setupEventDelegation('#list')
    document.querySelector('#list li').click()

    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: Trimmed')
    consoleSpy.mockRestore()
  })

  it('should not log when clicking on list itself', () => {
    document.body.innerHTML = `
      <ul id="testList">
        <li>Item 1</li>
      </ul>
    `
    const consoleSpy = vi.spyOn(console, 'log')

    setupEventDelegation('#testList')
    document.querySelector('#testList').click()

    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should handle empty list items', () => {
    document.body.innerHTML = `
      <ul id="list">
        <li></li>
      </ul>
    `
    const consoleSpy = vi.spyOn(console, 'log')

    setupEventDelegation('#list')
    document.querySelector('#list li').click()

    expect(consoleSpy).toHaveBeenCalledWith('Item clicked: ')
    consoleSpy.mockRestore()
  })
})
