'use client'

import { useEffect, useState } from 'react'
import { MapPin, Cloud, Sun, CloudRain, Snowflake } from 'lucide-react'

interface VisitorData {
  ip: string
  city: string
  region: string
  country_name: string
  latitude?: number
  longitude?: number
}

interface WeatherData {
  temperature: number
  weathercode: number
  aqi?: number
}

const cityMap: Record<string, string> = {
  'Shanghai': '上海',
  'Beijing': '北京',
  'Guangzhou': '广州',
  'Shenzhen': '深圳',
  'Hangzhou': '杭州',
  'Chengdu': '成都',
  'Wuhan': '武汉',
  'Nanjing': '南京',
  'Xi\'an': '西安',
  'Chongqing': '重庆',
  'Suzhou': '苏州',
  'Tianjin': '天津',
  'Changsha': '长沙',
  'Ningbo': '宁波',
  'Foshan': '佛山',
  'Dongguan': '东莞',
  'Wuxi': '无锡',
  'Qingdao': '青岛',
  'Zhengzhou': '郑州',
  'Hefei': '合肥',
  'Hong Kong': '香港',
  'Taipei': '台北',
  'Jinan': '济南',
  'Shenyang': '沈阳',
  'Xiamen': '厦门',
  'Harbin': '哈尔滨',
  'Kunming': '昆明',
  'Nanning': '南宁',
  'Fuzhou': '福州',
  'Changchun': '长春',
}

function translateCity(city: string) {
  // 简单匹配，如果字典里有就返回中文，否则返回原值
  return cityMap[city] || city
}

export function VisitorInfo() {
  const [data, setData] = useState<VisitorData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 获取 IP 信息
        const ipRes = await fetch('https://ipapi.co/json/')
        if (!ipRes.ok) throw new Error('IP API limit reached')
        const ipData = await ipRes.json()
        
        if (ipData.error) throw new Error(ipData.reason)
        
        setData({
          ip: ipData.ip,
          city: ipData.city || 'Unknown',
          region: ipData.region || '',
          country_name: ipData.country_name || 'Earth',
          latitude: ipData.latitude,
          longitude: ipData.longitude
        })

        // 2. 获取天气和空气质量信息
        if (ipData.latitude && ipData.longitude) {
          const [weatherRes, airRes] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current_weather=true`),
            fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current=us_aqi`)
          ])

          const weatherData = await weatherRes.json()
          const airData = await airRes.json()

          if (weatherData.current_weather) {
            setWeather({
              temperature: weatherData.current_weather.temperature,
              weathercode: weatherData.current_weather.weathercode,
              aqi: airData.current?.us_aqi
            })
          }
        }
      } catch (err) {
        console.error('Failed to fetch info:', err)
        setData({
          ip: '127.0.0.1',
          city: 'Unknown',
          region: '',
          country_name: 'Earth'
        })
      } finally {
        setLoading(false)
      }
    }

    // 延迟 1 秒执行
    const timer = setTimeout(fetchData, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getWeatherInfo = (code: number) => {
    if (code === 0) return { icon: <Sun className="h-3.5 w-3.5 text-yellow-400" />, text: '晴' }
    if (code <= 3) return { icon: <Cloud className="h-3.5 w-3.5 text-gray-300" />, text: '多云' }
    if (code <= 48) return { icon: <Cloud className="h-3.5 w-3.5 text-gray-400" />, text: '雾' }
    if (code <= 67) return { icon: <CloudRain className="h-3.5 w-3.5 text-blue-400" />, text: '雨' }
    if (code <= 77) return { icon: <Snowflake className="h-3.5 w-3.5 text-cyan-200" />, text: '雪' }
    if (code <= 82) return { icon: <CloudRain className="h-3.5 w-3.5 text-blue-500" />, text: '大雨' }
    return { icon: <Snowflake className="h-3.5 w-3.5 text-cyan-300" />, text: '雪' }
  }

  if (loading || !data) return null

  const weatherInfo = weather ? getWeatherInfo(weather.weathercode) : null

  return (
    <div className="flex flex-col gap-2 text-xs text-white/90 bg-black/30 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-lg animate-in fade-in slide-in-from-top-2 duration-700 hover:bg-black/40 transition-all cursor-default select-none min-w-[240px]">
      {/* 第一行：位置信息 */}
      <div className="flex items-center gap-1.5 w-full">
        <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
        <span className="opacity-80">来自</span>
        <span className="font-semibold text-white">
          {translateCity(data.city || data.region || data.country_name)}
        </span>
      </div>

      {/* 第二行：IP 地址 (全宽显示) */}
      <div className="w-full bg-white/5 px-2 py-2 rounded-md border border-white/5">
        <span className="text-white/80 text-sm font-mono tracking-wide block text-center select-text font-medium">
          {data.ip}
        </span>
      </div>

      {/* 第三行：天气信息 */}
      {weather && weatherInfo && (
        <div className="flex items-center justify-between w-full animate-in fade-in zoom-in duration-500 pt-0.5 border-t border-white/10 mt-0.5 pt-2">
          <div className="flex items-center gap-1.5">
            {weatherInfo.icon}
            <span className="font-medium">{weatherInfo.text}</span>
            <span className="font-mono font-bold text-white text-sm">{weather.temperature}°</span>
          </div>

          {typeof weather.aqi === 'number' && (
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
              <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px] ${
                weather.aqi <= 50 ? 'bg-green-400 shadow-green-400/50' :
                weather.aqi <= 100 ? 'bg-yellow-400 shadow-yellow-400/50' :
                'bg-red-400 shadow-red-400/50'
              }`} />
              <span className="font-mono text-[10px] opacity-90 font-medium">AQI {weather.aqi}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
