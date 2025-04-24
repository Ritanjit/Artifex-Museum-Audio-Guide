import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import "./AudioPlayer.css";
import thumbnail from "../../assets/horai.png";
import englishAudio from "../../assets/audioenglish.wav";
import hindiAudio from "../../assets/audiohindi.wav";
import assameseAudio from "../../assets/audioassamese.wav";

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [language, setLanguage] = useState('english');
    const audioRef = useRef(null);

    // Map language to audio file
    const languageAudioMap = {
        english: englishAudio,
        hindi: hindiAudio,
        assamese: assameseAudio
    };

    // Map language to description
    const languageDescriptions = {
        english: `The Satras of Assam are monastic institutions established by the great Vaishnavite saint Srimanta Sankardeva and his disciples in the 15th-16th centuries. These unique centers of art, culture, and spirituality have preserved traditional dance, music, and craft forms for over five centuries.

Each Satra follows a strict daily routine of prayers, rituals, and artistic practices. The institution serves as both a spiritual center and a cultural academy, where young devotees learn traditional arts like Borgeet (classical music), Sattriya dance, and mask-making.

The Majuli Museum preserves artifacts and documents that showcase the rich history of these Satras, which played a crucial role in shaping Assamese culture and identity.`,

        hindi: `असम के सत्र महान वैष्णव संत श्रीमंत शंकरदेव और उनके शिष्यों द्वारा 15वीं-16वीं शताब्दी में स्थापित मठ संस्थान हैं। कला, संस्कृति और आध्यात्मिकता के ये अनूठे केंद्र पांच शताब्दियों से अधिक समय से पारंपरिक नृत्य, संगीत और शिल्प रूपों को संरक्षित कर रहे हैं।

प्रत्येक सत्र प्रार्थना, अनुष्ठान और कलात्मक प्रथाओं के सख्त दैनिक कार्यक्रम का पालन करता है। संस्था एक आध्यात्मिक केंद्र और एक सांस्कृतिक अकादमी दोनों के रूप में कार्य करती है, जहां युवा भक्त बोरगीत (शास्त्रीय संगीत), सत्रीया नृत्य और मुखौटा निर्माण जैसी पारंपरिक कलाएं सीखते हैं।

माजुली संग्रहालय कलाकृतियों और दस्तावेजों को संरक्षित करता है जो इन सत्रों के समृद्ध इतिहास को प्रदर्शित करता है, जिसने असमिया संस्कृति और पहचान को आकार देने में महत्वपूर्ण भूमिका निभाई है।`,

        assamese: `অসমৰ সত্ৰসমূহ মহাপুৰুষ শ্ৰীমন্ত শংকৰদেৱ আৰু তেওঁৰ শিষ্যসকলে ১৫-১৬ শতিকাত স্থাপন কৰা বৈষ্ণৱ মঠ। কলা-সংস্কৃতি আৰু আধ্যাত্মিকতাৰ এই অনন্য কেন্দ্ৰবোৰে পাঁচশতাধিক বছৰ ধৰি পৰম্পৰাগত নৃত্য, সংগীত আৰু শিল্পক ৰক্ষা কৰি আহিছে।

প্ৰতিটো সত্ৰত প্ৰাৰ্থনা, আচাৰ-অনুষ্ঠান আৰু কলা-চৰ্চাৰ কঠোৰ দৈনন্দিন কাৰ্যসূচী পালন কৰা হয়। এই অনুষ্ঠানবোৰে এক আধ্যাত্মিক কেন্দ্ৰ আৰু সাংস্কৃতিক বিদ্যালয়ৰ দৰে কাম কৰে, য'ত ডেকা-গাভৰুৱে বৰগীত, সত্ৰীয়া নৃত্য, মুখা তৈয়াৰী আদি পৰম্পৰাগত কলা শিকে।

মাজুলী সংগ্ৰহালয়ে সত্ৰৰ সমৃদ্ধ ইতিহাসৰ সাক্ষ্য দিয়া বিভিন্ন সামগ্ৰী আৰু দলিল সংৰক্ষণ কৰিছে, যিয়ে অসমীয়া সংস্কৃতি আৰু পৰিচয় গঢ়াত গুৰুত্বপূৰ্ণ ভূমিকা পালন কৰিছে।`
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    useEffect(() => {
        const audio = audioRef.current;
        
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            audio.volume = volume;
        };

        const handleError = (e) => {
            console.error("Audio error:", e);
        };

        if (audio) {
            audio.addEventListener("loadedmetadata", handleLoadedMetadata);
            audio.addEventListener("timeupdate", handleTimeUpdate);
            audio.addEventListener("error", handleError);
        }

        return () => {
            if (audio) {
                audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
                audio.removeEventListener("timeupdate", handleTimeUpdate);
                audio.removeEventListener("error", handleError);
            }
        };
    }, [volume]);

    // Effect to change audio source when language changes
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = isPlaying;
            const currentPlaybackTime = audioRef.current.currentTime;
            
            audioRef.current.pause();
            audioRef.current.src = languageAudioMap[language];
            audioRef.current.load();
            
            // After metadata is loaded, set the time and resume if needed
            const handleCanPlay = () => {
                audioRef.current.currentTime = currentPlaybackTime;
                if (wasPlaying) {
                    audioRef.current.play().catch(e => console.error("Play failed:", e));
                }
                audioRef.current.removeEventListener('canplay', handleCanPlay);
            };
            
            audioRef.current.addEventListener('canplay', handleCanPlay);
            setIsPlaying(wasPlaying);
        }
    }, [language]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (event) => {
        const newTime = parseFloat(event.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    const toggleMute = () => {
        audioRef.current.volume = volume > 0 ? 0 : 0.7;
        setVolume(volume > 0 ? 0 : 0.7);
    };

    const skipForward = () => {
        audioRef.current.currentTime += 10;
        setCurrentTime(audioRef.current.currentTime);
    };

    const skipBackward = () => {
        audioRef.current.currentTime -= 10;
        setCurrentTime(audioRef.current.currentTime);
    };

    return (
        <div className="audio-player-container">
            {/* Audio Player (now on the left) */}
            <div className="audio-player">
                {/* Language Selector */}
                <div className="language-selector">
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-dropdown"
                    >
                        <option value="english">English</option>
                        <option value="hindi">हिंदी (Hindi)</option>
                        <option value="assamese">অসমীয়া (Assamese)</option>
                    </select>
                </div>

                {/* Exhibit Info at Top */}
                <div className="exhibit-info">
                    <img 
                        src={thumbnail} 
                        alt="Exhibit thumbnail" 
                        className="exhibit-thumbnail"
                    />
                    <div className="exhibit-text">
                        <h3 className="exhibit-title">History of Satras</h3>
                        <p className="exhibit-subtitle">Majuli Museum, Govt. of Assam</p>
                    </div>
                </div>

                {/* Audio Controls */}
                <div className="audio-controls">
                    <div className="control-buttons">
                        <button className="skip-button" onClick={skipBackward}>
                            <FaStepBackward /> 10s
                        </button>
                        <button 
                            className="play-pause-button" 
                            onClick={togglePlayPause}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
                        </button>
                        <button className="skip-button" onClick={skipForward}>
                            10s <FaStepForward />
                        </button>
                    </div>

                    <div className="progress-container">
                        <div className="time-display-container">
                            <span className="time-display">{formatTime(currentTime)}</span>
                            <span className="time-display">{formatTime(duration)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-slider"
                        />
                    </div>

                    <div className="volume-controls">
                        <button 
                            className="volume-button"
                            onClick={toggleMute}
                            aria-label={volume > 0 ? "Mute" : "Unmute"}
                        >
                            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                        />
                    </div>
                </div>
            </div>
            
            {/* Text Description (now on the right) */}
            <div className="text-description">
                <h2 className="description-title">The Satras of Assam</h2>
                <div className="description-content">
                    {languageDescriptions[language].split('\n\n').map((paragraph, index) => (
                        <p key={index} className="description-paragraph">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            <audio
                ref={audioRef}
                src={languageAudioMap[language]}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => console.error("Audio error:", e)}
            />
        </div>
    );
};

export default AudioPlayer;