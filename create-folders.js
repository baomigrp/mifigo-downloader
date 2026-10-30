const fs = require("fs");
const path = require("path");

// 직접 지정할 최상위 폴더
const ROOT_DIR = "D:\\mifigo\\01.파일\\01.사진\\02.기타시리즈";

// 1~3번째 뎁스에 모두 번호가 매겨진 폴더 구조
const folders = {
    "01. 디즈니 및 애니메이션": {
        "01. 디즈니 시리즈": [
            "71012 Disney Series 1 (2016)",
            "71024 Disney Series 2 (2019)",
            "71038 Disney 100 (2023)"
        ],
        "02. 심슨 가족": [
            "71005 The Simpsons Series 1 (2014)",
            "71009 The Simpsons Series 2 (2015)"
        ],
        "03. 루니 툰": [
            "71030 Looney Tunes (2021)"
        ],
        "04. 머펫": [
            "71033 The Muppets (2022)"
        ],
        "05. 슈렉": [
            "71053 Shrek (2026)"
        ]
    },
    "02. 영화 및 엔터테인먼트": {
        "01. 레고 무비 프랜차이즈": [
            "71004 The LEGO Movie (2014)",
            "71017 The LEGO Batman Movie Series 1 (2017)",
            "71019 The LEGO Ninjago Movie (2017)",
            "71020 The LEGO Batman Movie Series 2 (2018)",
            "71023 The LEGO Movie 2 (2019)"
        ],
        "02. 해리 포터": [
            "71022 Harry Potter and Fantastic Beasts Series 1 (2018)",
            "71028 Harry Potter Series 2 (2020)"
        ],
        "03. 던전 앤 드래곤": [
            "71047 Dungeons & Dragons (2024)"
        ]
    },
    "03. 슈퍼히어로": {
        "01. DC 코믹스": [
            "71026 DC Super Heroes (2020)"
        ],
        "02. 마블 스튜디오": [
            "71031 Marvel Studios Series 1 (2021)",
            "71039 Marvel Studios Series 2 (2023)"
        ],
        "03. 스파이더맨": [
            "71050 Spider-Man Across the Spider-Verse (2025)"
        ]
    },
    "04. 스포츠 및 국가 한정 특별판": {
        "01. 국가·팀 특별판": [
            "8909 Team GB (2012)",
            "71014 DFB Minifigures (2016)"
        ],
        "02. 스포츠 특별판": [
            "71049 F1 Collectible Race Cars (2025)"
        ]
    }
};

// 폴더 생성 함수
function createFolders(baseDir, structure) {
    for (const [folderName, value] of Object.entries(structure)) {
        const currentPath = path.join(baseDir, folderName);

        fs.mkdirSync(currentPath, { recursive: true });

        if (Array.isArray(value)) {
            // 제품 폴더 생성
            for (const item of value) {
                fs.mkdirSync(path.join(currentPath, item), {
                    recursive: true
                });
            }
        } else {
            // 하위 분류 및 제품 폴더 생성
            createFolders(currentPath, value);
        }
    }
}

// 실행
createFolders(ROOT_DIR, folders);

console.log("레고 미니피규어 폴더 생성 및 번호 매기기 완료!");