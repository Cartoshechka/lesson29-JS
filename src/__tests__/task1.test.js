import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handleButtonClick } from '../main'

describe('Task 1: handleButtonClick - Button Click Event Handler', () => {
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
