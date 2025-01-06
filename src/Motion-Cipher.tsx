'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Key, Lock, Unlock } from 'lucide-react'

// Helper function to apply Vigenère Cipher
const vigenereEncrypt = (text: string, key: string) => {
  let result = ""
  let keyIndex = 0

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)

    // Encrypt only alphabetic characters
    if (charCode >= 32 && charCode <= 126) {
      const keyCharCode = key.charCodeAt(keyIndex % key.length)
      const encryptedCharCode = ((charCode - 32 + keyCharCode - 32) % 95) + 32
      result += String.fromCharCode(encryptedCharCode)
      keyIndex++
    } else {
      result += text[i]
    }
  }

  return result
}

// Helper function to decode Vigenère Cipher
const vigenereDecrypt = (text: string, key: string) => {
  let result = ""
  let keyIndex = 0

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)

    // Decrypt only alphabetic characters
    if (charCode >= 32 && charCode <= 126) {
      const keyCharCode = key.charCodeAt(keyIndex % key.length)
      const decryptedCharCode =
        ((charCode - 32 - (keyCharCode - 32) + 95) % 95) + 32
      result += String.fromCharCode(decryptedCharCode)
      keyIndex++
    } else {
      result += text[i]
    }
  }

  return result
}

// Helper function to process string for decryption
const processForDecryption = (str: string) => {
  // Remove whitespace and normalize string
  return str.trim().replace(/\s/g, '')
    // Handle URL-safe base64 characters
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    // Add padding if necessary
    .replace(/[^A-Za-z0-9+/]/g, '')
    .padEnd(Math.ceil(str.length / 4) * 4, '=');
}

export function MotionUCipher() {
  const [input, setInput] = useState("")
  const [encrypted, setEncrypted] = useState("")
  const [decrypted, setDecrypted] = useState("")
  const [error, setError] = useState<string>("")
  const key = "motion-u" // Encryption key

  const handleEncrypt = () => {
    setError("")
    if (!input.trim()) {
      setError("Please enter some text to encrypt")
      return
    }

    try {
      // First encrypt using Vigenère Cipher
      const vigenereEncrypted = vigenereEncrypt(input, key)
      // Then encode using Base64
      const base64Encrypted = btoa(vigenereEncrypted)
      setEncrypted(base64Encrypted)
    } catch (error) {
      setError("Failed to encrypt text")
      console.error(error)
    }
  }

  const handleDecrypt = () => {
    setError("")
    if (!encrypted.trim()) {
      setError("Please encrypt some text first")
      return
    }

    try {
      // Process the encrypted string first
      const processedText = processForDecryption(encrypted);
      // First decode from Base64
      const base64Decrypted = atob(processedText);
      // Then decrypt using Vigenère Cipher
      const vigenereDecrypted = vigenereDecrypt(base64Decrypted, key);
      setDecrypted(vigenereDecrypted);
    } catch (error) {
      setError("Invalid encrypted text! Please ensure you've copied the entire encrypted string.")
      console.error(error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      setError("Failed to copy text")
      console.error(err)
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="w-full h-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl font-bold">
            <Key className="w-8 h-8" />
            Motion-U Cipher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Text:</label>
            <Textarea
              placeholder="Enter text to encrypt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleEncrypt} className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Encrypt
            </Button>
            <Button onClick={handleDecrypt} variant="secondary" className="flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              Decrypt
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Encrypted Text:</label>
              {encrypted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(encrypted)}
                  className="h-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Textarea
              value={encrypted}
              readOnly
              className="min-h-[100px] bg-muted"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Decrypted Text:</label>
              {decrypted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(decrypted)}
                  className="h-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Textarea
              value={decrypted}
              readOnly
              className="min-h-[100px] bg-muted"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}