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
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string>("")
  const key = "motion-u" // Encryption key

  const handleEncryptDecrypt = () => {
    setError("")
    if (!input.trim()) {
      setError("Please enter some text")
      return
    }

    try {
      // Try to decrypt first
      const processedText = processForDecryption(input);
      const base64Decrypted = atob(processedText);
      const vigenereDecrypted = vigenereDecrypt(base64Decrypted, key);
      setOutput(vigenereDecrypted);
    } catch (error) {
      // If decryption fails, encrypt the input
      try {
        const vigenereEncrypted = vigenereEncrypt(input, key);
        const base64Encrypted = btoa(vigenereEncrypted);
        setOutput(base64Encrypted);
      } catch (error) {
        setError("Failed to encrypt/decrypt text");
        console.error(error);
      }
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
              placeholder="Enter text to encrypt or decrypt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleEncryptDecrypt} className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Encrypt/Decrypt
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Output Text:</label>
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(output)}
                  className="h-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Textarea
              value={output}
              readOnly
              className="min-h-[100px] bg-muted"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}