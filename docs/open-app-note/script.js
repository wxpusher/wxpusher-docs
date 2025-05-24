document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的手机品牌
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand');

    // 手机品牌映射
    const brandMap = {
        'iOS': 'apple',
        'Android_Xiaomi': 'xiaomi',
        'Android_Huawei': 'huawei',
        'Android_Vivo': 'vivo',
        'Android_Honor': 'honor'
    };

    // 获取所有品牌区块
    const brandSections = document.querySelectorAll('.brand-section');

    // 为每个品牌区块添加点击事件
    brandSections.forEach(section => {
        const header = section.querySelector('.brand-header');
        const videoContainer = section.querySelector('.video-container');

        header.addEventListener('click', () => {
            // 切换当前区块的展开/折叠状态
            section.classList.toggle('active');
            videoContainer.classList.toggle('active');
        });
    });

    // 如果URL中有品牌参数，自动展开对应区块
    if (brand && brandMap[brand]) {
        const targetSection = document.getElementById(brandMap[brand]);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.querySelector('.video-container').classList.add('active');
        }
    }

    // // 检测用户设备
    // function detectDevice() {
    //     const userAgent = navigator.userAgent.toLowerCase();
    //     let detectedBrand = null;

    //     if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    //         detectedBrand = 'apple';
    //     } else if (userAgent.includes('mi ') || userAgent.includes('xiaomi')) {
    //         detectedBrand = 'xiaomi';
    //     } else if (userAgent.includes('huawei')) {
    //         detectedBrand = 'huawei';
    //     } else if (userAgent.includes('vivo')) {
    //         detectedBrand = 'vivo';
    //     } else if (userAgent.includes('honor')) {
    //         detectedBrand = 'honor';
    //     }

    //     // 如果检测到品牌且URL中没有品牌参数，自动展开对应区块
    //     if (detectedBrand && !brand) {
    //         const targetSection = document.getElementById(detectedBrand);
    //         if (targetSection) {
    //             targetSection.classList.add('active');
    //             targetSection.querySelector('.video-container').classList.add('active');
    //         }
    //     }
    // }

    // // 执行设备检测
    // detectDevice();
}); 