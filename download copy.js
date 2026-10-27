const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 시리즈 16 설정
const seriesCode = '71018';     // 해당 시리즈의 코드!!!!!'😒
const series = '17';         // 해당 시리즈의 번호!!!!!😒
const downloadDir = path.join(__dirname, `lego_images_series_${series}(${seriesCode})`);

// 폴더가 없으면 자동 생성
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
    console.log(`📁 저장 폴더 생성됨: ${downloadDir}`);
}

// 📌 시리즈 17 !!!!!😒
const minifigures = [
    { no: "0", engName: "bag", korName: "봉지" },

    { no: 1, engName: "Pro Surfer", korName: "프로 서퍼" },
    { no: 2, engName: "Circus Strong Man", korName: "서커스 차력사" },
    { no: 3, engName: "Gourmet Chef", korName: "고급 요리사" },
    { no: 4, engName: "Corn Cob Guy", korName: "옥수수맨" },
    { no: 5, engName: "Veterinarian", korName: "수의사" },
    { no: 6, engName: "Hot Dog Vendor", korName: "핫도그 판매원" },
    { no: 7, engName: "Butterfly Girl", korName: "나비 소녀" },
    { no: 8, engName: "Roman Gladiator", korName: "로마 검투사" },
    { no: 9, engName: "Connoisseur", korName: "감정가" },
    { no: 10, engName: "Battle Dwarf", korName: "전투 드워프" },
    { no: 11, engName: "Retro Space Hero", korName: "레트로 우주 영웅" },
    { no: 12, engName: "Yuppie", korName: "여피" },
    { no: 13, engName: "Rocket Boy", korName: "로켓 소년" },
    { no: 14, engName: "Dance Instructor", korName: "댄스 강사" },
    { no: 15, engName: "Elf Maiden", korName: "엘프 아가씨" },
    { no: 16, engName: "Highwayman", korName: "노상강도" },

    { no: 17, engName: "set", korName: "전체 세트" }
];

// 이미지 다운로드 함수
async function downloadImage(url, filename) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://rebrickable.com/'
            }
        });

        const filePath = path.join(downloadDir, filename);
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ 다운로드 실패 (${filename}):`, error.message);
    }
}

// 메인 실행 함수
async function startDownload() {
    console.log(`🚀 레고 시리즈 ${seriesCode} 이미지 다운로드 시작 (한글명 포함)...\n`);

    for (const fig of minifigures) {
        // 💡 파일명 형식: 71013-1_Desert_Warrior_사막의_전사.jpg
        const filename = `${seriesCode}-${fig.no}-${fig.engName}-${fig.korName}.jpg`;
        
        // Rebrickable CDN URL 구조 
        const imageUrl = `https://cdn.rebrickable.com/media/thumbs/sets/${seriesCode}-${fig.no}.jpg/1000x800p.jpg?1`;
        
        console.log(`[다운로드 중] ${filename}`);
        await downloadImage(imageUrl, filename);
        
        // 서버 부하 방지용 0.5초 대기
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✨ 시리즈 16 모든 이미지 다운로드 및 한글명 파일명 적용이 완료되었습니다!');
}

startDownload();