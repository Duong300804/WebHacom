package com.example.computer_store.common;
import java.util.*;

public class NumberUtils {
    public static String formatNumber(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        String[] dataSplit = input.split("\\.");
        String dataInt = dataSplit[0];
        // Nếu không có phần thập phân, dataSplit sẽ rỗng sau khi bỏ phần nguyên
        String decimalPart = (dataSplit.length > 1) ? dataSplit[1] : "";
        // Nếu phần nguyên < 4 chữ số, trả về nguyên gốc (có phần thập phân nếu có)
        if (dataInt.length() < 4) {
            return decimalPart.isEmpty() ? dataInt : dataInt + "." + decimalPart;
        }
        // Chia phần nguyên thành các nhóm hàng nghìn
        String subData = dataInt.length() % 3 == 0 ? "" : dataInt.substring(0, dataInt.length() % 3);
        String dataMatch = dataInt.substring(dataInt.length() % 3);
        String[] dataMatchGroups = dataMatch.split("(?<=\\G.{3})");
        List<String> dataFinal = new ArrayList<>();
        if (!subData.isEmpty()) {
            dataFinal.add(subData);
        }
        dataFinal.addAll(Arrays.asList(dataMatchGroups));
        // Nối phần nguyên bằng dấu chấm
        String formattedInt = String.join(".", dataFinal);
        // Nếu có phần thập phân, nối với dấu chấm; nếu không, chỉ trả về phần nguyên
        return decimalPart.isEmpty() ? formattedInt : formattedInt + "." + decimalPart;
    }

    public static String formatNumber(Number num) {
        return formatNumber(num.toString()); // Gọi phương thức String để tái sử dụng logic
    }
}
