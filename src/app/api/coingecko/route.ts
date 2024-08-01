// pages/api/fetch-currencies.ts
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        //     // Axios isteği
        //     //const response = await axios.get('https://api.coingecko.com/api/v3/coins/top_gainers_losers?vs_currency=usd&duration=24h&x-cg-pro-api-key=CG-xHPx6R1bygdrdgi9MbkDBfso');

        //     console.log(response.data);
        //     return NextResponse.json({ data: response.data }, { status: 200 });
    } catch (error: any) {
        console.error('API isteği hatası:', error.response?.data);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
