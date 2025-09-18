import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Calling test-selenium API...')
    
    const response = await fetch('https://scrapper-dp2-fork.onrender.com/test-selenium', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DP2-Cevicheria/1.0',
      },
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    console.log('Test selenium response:', data)
    
    return NextResponse.json({ 
      success: true, 
      data: data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error calling test-selenium:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
