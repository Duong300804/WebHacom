package com.example.computer_store.common;

import java.text.SimpleDateFormat;
import java.util.Locale;

public class TimeFormat {
    public static final SimpleDateFormat formatteryyyyMMdd = new SimpleDateFormat("yyyy/MM/dd");

    public static final SimpleDateFormat formatterddMMyyyy = new SimpleDateFormat("dd/MM/yyyy");
    /**
     * yyyyMMdd
     */
    public static final SimpleDateFormat formatteryyyyMMdd2 = new SimpleDateFormat("yyyyMMdd");

    /**
     * yyyy年MM月DD日
     */
    public static final SimpleDateFormat formatteryyyyMMddJP = new SimpleDateFormat("yyyy年MM月dd日", java.util.Locale.JAPAN);
    /**
     * yyyy/MM/dd HH:mm
     */
    public static final SimpleDateFormat formatteryyyyMMddHHmm = new SimpleDateFormat("yyyy/MM/dd HH:mm");
    /**
     * yyyyMMddHHmmssSSS
     */
    public static final SimpleDateFormat formatteryyyyMMddHHmmssSSS = new SimpleDateFormat("yyyyMMddHHmmssSSS");
    public static final SimpleDateFormat formatteryyyyMMdd_HHmmss_SSS = new SimpleDateFormat("yyyyMMdd_HHmmss_SSS");
    public static final SimpleDateFormat formatterEEEMMMdd_HHmmss_zzz_yyy = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
    /**
     * yyyy/MM/dd HH:mm:ss
     */
    public static final SimpleDateFormat formatteryyyyMMddHHmmss = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
    public static final SimpleDateFormat formatteryyyyMMddHHmmssSSS2 = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss:SSS");
    /**
     * yyyyMMddHHmmss
     */
    public static final SimpleDateFormat formatteryyyyMMddHHmmss2 = new SimpleDateFormat("yyyyMMddHHmmss");
    /**
     * yyyyMMddHHmmss
     */
    public static final SimpleDateFormat formatteryyyyMMddHHmm2 = new SimpleDateFormat("yyyyMMddHHmm");
    /**
     * HHmm
     */
    public static final SimpleDateFormat formatterHHmm = new SimpleDateFormat("HHmm");
    /**
     * HH:mm
     */
    public static final SimpleDateFormat formatterHHmm2 = new SimpleDateFormat("HH:mm");
    /**
     * MM/dd
     */
    public static final SimpleDateFormat formatterMMdd = new SimpleDateFormat("MM/dd");
    /**
     * MM/dd (EEE)
     */
    public static final SimpleDateFormat formatterMMddEEEJP = new SimpleDateFormat("MM/dd (EEE)", java.util.Locale.JAPAN);

    /**
     * yyyy年MM月dd日 (EEE) 2021年4月9日 (金)
     */
    public static final SimpleDateFormat formatteryyMMddEEEJP = new SimpleDateFormat("yyyy年MM月dd日 (EEE)", java.util.Locale.JAPAN);
    /**
     * /**
     * yy.MM.dd
     */
    public static final SimpleDateFormat formatteryyMMdd = new SimpleDateFormat("yy.MM.dd");

    /**
     * yyyy-MM
     */
    public static final SimpleDateFormat formatteryyyyMM = new SimpleDateFormat("yyyy-MM");
    public static final SimpleDateFormat formatteryyyyMMdd3 = new SimpleDateFormat("yyyy-MM-dd");
    /**
     * yyyy-MM
     */
    public static final SimpleDateFormat formatteryyyyMM4 = new SimpleDateFormat("yyyyMM");
    /**
     * yyyy年MM
     */
    public static final SimpleDateFormat formatteryyyyMMJP = new SimpleDateFormat("yyyy年MM", Locale.JAPANESE);

    public final static SimpleDateFormat formatYMDHMS = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    /**
     * /**
     * yy.MM.dd
     */
    public static final SimpleDateFormat formatterDDMMYYYY = new SimpleDateFormat("dd.MM.yyyy");
}
