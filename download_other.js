const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 시리즈 17 설정
const seriesCode = '71053';   // 해당 시리즈의 코드📌
//const series = '29';          // 해당 시리즈의 번호📌

// 1. 기존 프로젝트 내 기본 폴더 경로
const defaultDir = path.join(__dirname, `lego_other_series_(${seriesCode})`);
// 2. 추가로 저장할 원하시는 절대 경로
const customDir = `D:\\mifigo\\01.파일\\01.사진\\02.기타시리즈\\01. 디즈니 및 애니메이션\\05. 슈렉\\71053 Shrek (2026)`;

// 양쪽 폴더가 없으면 각각 자동 생성
[defaultDir, customDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 저장 폴더 생성됨: ${dir}`);
    }
});

// Disney Series 1 (71053) 🎬
const minifigures = [
    { no: "0", engName: "bag", korName: "봉지" },

    { no: 1, engName: "Thelonious", korName: "텔로니어스" },
    { no: 2, engName: "Puss in Boots", korName: "장화 신은 고양이" },
    { no: 3, engName: "Gingy", korName: "진저브레드 맨" },
    { no: 4, engName: "Shrek", korName: "슈렉" },
    { no: 5, engName: "Dragon", korName: "드래곤" },
    { no: 6, engName: "Fiona and Donkey", korName: "피오나와 동키" },
    { no: 7, engName: "Merlin", korName: "멀린" },
    { no: 8, engName: "Pinocchio", korName: "피노키오" },
    { no: 9, engName: "Big Bad Wolf", korName: "큰 나쁜 늑대" },
    { no: 10, engName: "Lord Farquaad", korName: "파콰드 경" },
    { no: 11, engName: "Fairy Godmother", korName: "요정 대모" },
    { no: 12, engName: "Prince Charming", korName: "차밍 왕자" },

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
        // imageUrl = `https://cdn.rebrickable.com/media/thumbs/sets/${seriesCode}-${fig.no}.jpg/1000x800p.jpg?1`;
        // 📌 새로운 사이트의 이미지 URL 규칙 적용
        imageUrl = `https://minifigtracker.com/assets/figures/${seriesCode}-${fig.no}.png`;
        
        console.log(`[다운로드 중] ${filename}`);
        await downloadImageToBoth(imageUrl, filename);
        
        // 서버 부하 방지용 0.5초 대기
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✨ 양쪽 폴더에 모든 이미지 다운로드 작업이 완료되었습니다!');
}

startDownload();