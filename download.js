const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 시리즈 17 설정
const seriesCode = '71052';   // 해당 시리즈의 코드📌
const series = '29';          // 해당 시리즈의 번호📌

// 1. 기존 프로젝트 내 기본 폴더 경로
const defaultDir = path.join(__dirname, `lego_images_series_${series}(${seriesCode})`);
// 2. 추가로 저장할 원하시는 절대 경로
const customDir = `D:\\mifigo\\01.파일\\01.사진\\01.정규시리즈\\시리즈${series}(${seriesCode})`;

// 양쪽 폴더가 없으면 각각 자동 생성
[defaultDir, customDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 저장 폴더 생성됨: ${dir}`);
    }
});

// 시리즈 29(71052)📌
const minifigures = [
    { no: "0", engName: "bag", korName: "봉지" },

    { no: 1, engName: "Robot T. rex", korName: "로봇 티렉스" },
    { no: 2, engName: "Marine Biologist", korName: "해양 생물학자" },
    { no: 3, engName: "BIONICLE Cosplayer", korName: "바이오니클 코스플레이어" },
    { no: 4, engName: "Monster Hunter", korName: "몬스터 헌터" },
    { no: 5, engName: "Boba Cup Fan", korName: "버블티 팬" },
    { no: 6, engName: "Trash Monster", korName: "쓰레기 몬스터" },
    { no: 7, engName: "Chocolatier", korName: "초콜릿 장인" },
    { no: 8, engName: "Tuba Player", korName: "튜바 연주자" },
    { no: 9, engName: "Football Goalkeeper", korName: "축구 골키퍼" },
    { no: 10, engName: "Cute Witch", korName: "귀여운 마녀" },
    { no: 11, engName: "Mysterious Ronin", korName: "신비로운 낭인" },
    { no: 12, engName: "Unicorn Elf", korName: "유니콘 엘프" },

    { no: 13, engName: "set", korName: "전체 세트" },
    { no: 14, engName: "box", korName: "박스" }
];

// 이미지 다운로드 함수 (양쪽 폴더에 동시 저장)
async function downloadImageToBoth(url, filename) {
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

        // 저장할 두 곳의 전체 파일 경로
        const defaultPath = path.join(defaultDir, filename);
        const customPath = path.join(customDir, filename);

        // 스트림을 생성하여 각각 쓰기
        const writer1 = fs.createWriteStream(defaultPath);
        const writer2 = fs.createWriteStream(customPath);

        response.data.pipe(writer1);
        response.data.pipe(writer2);

        // 두 파일 모두 저장이 완료될 때까지 대기
        await Promise.all([
            new Promise((resolve, reject) => { writer1.on('finish', resolve); writer1.on('error', reject); }),
            new Promise((resolve, reject) => { writer2.on('finish', resolve); writer2.on('error', reject); })
        ]);

    } catch (error) {
        console.error(`❌ 다운로드 실패 (${filename}):`, error.message);
    }
}

// 메인 실행 함수
async function startDownload() {
    console.log(`🚀 레고 시리즈 ${seriesCode} 양쪽 폴더 동시 다운로드 시작...\n`);

    for (const fig of minifigures) {
        const filename = `${seriesCode}-${fig.no}_${fig.engName}_${fig.korName}.jpg`;
        
        let imageUrl = "";
        /* if (fig.no === "0" || fig.no === 17) {
            imageUrl = `https://cdn.rebrickable.com/media/thumbs/sets/${seriesCode}.jpg/1000x800p.jpg?1`;
        } else {
            imageUrl = `https://cdn.rebrickable.com/media/thumbs/sets/${seriesCode}-${fig.no}.jpg/1000x800p.jpg?1`;
        } */
        imageUrl = `https://cdn.rebrickable.com/media/thumbs/sets/${seriesCode}-${fig.no}.jpg/1000x800p.jpg?1`;
        
        console.log(`[다운로드 중] ${filename}`);
        await downloadImageToBoth(imageUrl, filename);
        
        // 서버 부하 방지용 0.5초 대기
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✨ 양쪽 폴더에 모든 이미지 다운로드 작업이 완료되었습니다!');
}

startDownload();