var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/fmi-client.js
function buildFmiForecastUrl(place) {
  if (typeof place !== "string" || place.trim() === "") {
    throw new TypeError("FMI place must be a non-empty string");
  }
  const url = new URL(FMI_WFS_URL);
  url.search = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "getFeature",
    storedquery_id: HARMONIE_POINT_FORECAST_QUERY,
    place: place.trim(),
    parameters: HARMONIE_FORECAST_PARAMETERS
  }).toString();
  return url;
}
function buildFmiObservationUrl(place) {
  if (typeof place !== "string" || place.trim() === "") {
    throw new TypeError("FMI place must be a non-empty string");
  }
  const url = new URL(FMI_WFS_URL);
  url.search = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "getFeature",
    storedquery_id: WEATHER_OBSERVATION_QUERY,
    place: place.trim()
  }).toString();
  return url;
}
async function fetchFmiForecast(place, fetchImpl = fetch) {
  if (typeof fetchImpl !== "function") {
    throw new TypeError("fetchImpl must be a function");
  }
  const url = buildFmiForecastUrl(place);
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(
      `FMI request failed with HTTP ${response.status} ${response.statusText}`
    );
  }
  return response.text();
}
async function fetchFmiObservations(place, fetchImpl = fetch) {
  if (typeof fetchImpl !== "function") {
    throw new TypeError("fetchImpl must be a function");
  }
  const url = buildFmiObservationUrl(place);
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(
      `FMI request failed with HTTP ${response.status} ${response.statusText}`
    );
  }
  return response.text();
}
var FMI_WFS_URL, HARMONIE_POINT_FORECAST_QUERY, HARMONIE_FORECAST_PARAMETERS, WEATHER_OBSERVATION_QUERY;
var init_fmi_client = __esm({
  "src/fmi-client.js"() {
    FMI_WFS_URL = "https://opendata.fmi.fi/wfs";
    HARMONIE_POINT_FORECAST_QUERY = "fmi::forecast::harmonie::surface::point::timevaluepair";
    HARMONIE_FORECAST_PARAMETERS = [
      "Temperature",
      "Humidity",
      "WindDirection",
      "WindSpeedMS",
      "Precipitation1h",
      "TotalCloudCover",
      "Visibility",
      "WindGust",
      "Pressure",
      "DewPoint",
      "WeatherSymbol3"
    ].join(",");
    WEATHER_OBSERVATION_QUERY = "fmi::observations::weather::timevaluepair";
  }
});

// node_modules/fast-xml-parser/src/util.js
function getAllMatches(string, regex) {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    const allmatches = [];
    allmatches.startIndex = regex.lastIndex - match[0].length;
    const len = match.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
}
function isExist(v) {
  return typeof v !== "undefined";
}
var nameStartChar, nameChar, nameRegexp, regexName, isName, DANGEROUS_PROPERTY_NAMES, criticalProperties;
var init_util = __esm({
  "node_modules/fast-xml-parser/src/util.js"() {
    "use strict";
    nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    regexName = new RegExp("^" + nameRegexp + "$");
    isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    DANGEROUS_PROPERTY_NAMES = [
      // '__proto__',
      // 'constructor',
      // 'prototype',
      "hasOwnProperty",
      "toString",
      "valueOf",
      "__defineGetter__",
      "__defineSetter__",
      "__lookupGetter__",
      "__lookupSetter__"
    ];
    criticalProperties = ["__proto__", "constructor", "prototype"];
  }
});

// node_modules/fast-xml-parser/src/validator.js
function validate(xmlData, options) {
  options = Object.assign({}, defaultOptions, options);
  const tags = [];
  let tagFound = false;
  let reachedRoot = false;
  if (xmlData[0] === "\uFEFF") {
    xmlData = xmlData.substr(1);
  }
  for (let i = 0; i < xmlData.length; i++) {
    if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
      i += 2;
      i = readPI(xmlData, i);
      if (i.err) return i;
    } else if (xmlData[i] === "<") {
      let tagStartPos = i;
      i++;
      if (xmlData[i] === "!") {
        i = readCommentAndCDATA(xmlData, i);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i] === "/") {
          closingTag = true;
          i++;
        }
        let tagName = "";
        for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
          tagName += xmlData[i];
        }
        tagName = tagName.trim();
        if (tagName[tagName.length - 1] === "/") {
          tagName = tagName.substring(0, tagName.length - 1);
          i--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "Invalid space after '<'.";
          } else {
            msg = "Tag '" + tagName + "' is an invalid name.";
          }
          return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
        }
        const result = readAttributeStr(xmlData, i);
        if (result === false) {
          return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
        }
        let attrStr = result.value;
        i = result.index;
        if (attrStr[attrStr.length - 1] === "/") {
          const attrStrStart = i - attrStr.length;
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
          } else {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
          } else if (tags.length === 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
          } else {
            const otg = tags.pop();
            if (tagName !== otg.tagName) {
              let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
              return getErrorObject(
                "InvalidTag",
                "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                getLineNumberForPosition(xmlData, tagStartPos)
              );
            }
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
          }
          if (reachedRoot === true) {
            return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
          } else if (options.unpairedTags.indexOf(tagName) !== -1) {
          } else {
            tags.push({ tagName, tagStartPos });
          }
          tagFound = true;
        }
        for (i++; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            if (xmlData[i + 1] === "!") {
              i++;
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else if (xmlData[i + 1] === "?") {
              i = readPI(xmlData, ++i);
              if (i.err) return i;
            } else {
              break;
            }
          } else if (xmlData[i] === "&") {
            const afterAmp = validateAmpersand(xmlData, i);
            if (afterAmp == -1)
              return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
            i = afterAmp;
          } else {
            if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
              return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
            }
          }
        }
        if (xmlData[i] === "<") {
          i--;
        }
      }
    } else {
      if (isWhiteSpace(xmlData[i])) {
        continue;
      }
      return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
    }
  }
  if (!tagFound) {
    return getErrorObject("InvalidXml", "Start tag expected.", 1);
  } else if (tags.length == 1) {
    return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
  } else if (tags.length > 0) {
    return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
  }
  return true;
}
function isWhiteSpace(char) {
  return char === " " || char === "	" || char === "\n" || char === "\r";
}
function readPI(xmlData, i) {
  const start = i;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] == "?" || xmlData[i] == " ") {
      const tagname = xmlData.substr(start, i - start);
      if (i > 5 && tagname === "xml") {
        return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
      } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
        i++;
        break;
      } else {
        continue;
      }
    }
  }
  return i;
}
function readCommentAndCDATA(xmlData, i) {
  if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
    for (i += 3; i < xmlData.length; i++) {
      if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
        i += 2;
        break;
      }
    }
  } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
    let angleBracketsCount = 1;
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === "<") {
        angleBracketsCount++;
      } else if (xmlData[i] === ">") {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
        i += 2;
        break;
      }
    }
  }
  return i;
}
function readAttributeStr(xmlData, i) {
  let attrStr = "";
  let startChar = "";
  let tagClosed = false;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
      if (startChar === "") {
        startChar = xmlData[i];
      } else if (startChar !== xmlData[i]) {
      } else {
        startChar = "";
      }
    } else if (xmlData[i] === ">") {
      if (startChar === "") {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i];
  }
  if (startChar !== "") {
    return false;
  }
  return {
    value: attrStr,
    index: i,
    tagClosed
  };
}
function scanAttributeTokens(attrStr) {
  const tokens = [];
  const len = attrStr.length;
  let i = 0;
  while (i < len) {
    const tokenStart = i;
    while (i < len && isWhiteSpace(attrStr[i])) i++;
    if (i >= len) break;
    if (attrStr[i] === "=") {
      i = tokenStart + 1;
      continue;
    }
    const leadingWs = attrStr.slice(tokenStart, i);
    const nameStart = i;
    while (i < len && !isWhiteSpace(attrStr[i]) && attrStr[i] !== "=") i++;
    const name = attrStr.slice(nameStart, i);
    let equalsGroup;
    let j = i;
    while (j < len && isWhiteSpace(attrStr[j])) j++;
    if (j < len && attrStr[j] === "=") {
      equalsGroup = attrStr.slice(i, j + 1);
      i = j + 1;
    }
    let quoteChar;
    let value;
    let k = i;
    while (k < len && isWhiteSpace(attrStr[k])) k++;
    if (k < len && (attrStr[k] === '"' || attrStr[k] === "'")) {
      const valueStart = k + 1;
      const closeIdx = attrStr.indexOf(attrStr[k], valueStart);
      if (closeIdx !== -1) {
        quoteChar = attrStr[k];
        value = attrStr.slice(valueStart, closeIdx);
        i = closeIdx + 1;
      }
    }
    const token = { startIndex: tokenStart };
    token[1] = leadingWs;
    token[2] = name;
    token[3] = equalsGroup;
    token[4] = quoteChar !== void 0 ? true : void 0;
    token[5] = quoteChar;
    token[6] = value;
    tokens.push(token);
  }
  return tokens;
}
function validateAttributeString(attrStr, options) {
  const matches = scanAttributeTokens(attrStr);
  const attrNames = {};
  for (let i = 0; i < matches.length; i++) {
    if (matches[i][1].length === 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
    } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
    } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
      return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
    }
    const attrName = matches[i][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
    }
    if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) {
      attrNames[attrName] = 1;
    } else {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
    }
  }
  return true;
}
function validateNumberAmpersand(xmlData, i) {
  let re = /\d/;
  if (xmlData[i] === "x") {
    i++;
    re = /[\da-fA-F]/;
  }
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === ";")
      return i;
    if (!xmlData[i].match(re))
      break;
  }
  return -1;
}
function validateAmpersand(xmlData, i) {
  i++;
  if (xmlData[i] === ";")
    return -1;
  if (xmlData[i] === "#") {
    i++;
    return validateNumberAmpersand(xmlData, i);
  }
  let count = 0;
  for (; i < xmlData.length; i++, count++) {
    if (xmlData[i].match(/\w/) && count < 20)
      continue;
    if (xmlData[i] === ";")
      break;
    return -1;
  }
  return i;
}
function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code,
      msg: message,
      line: lineNumber.line || lineNumber,
      col: lineNumber.col
    }
  };
}
function validateAttrName(attrName) {
  return isName(attrName);
}
function validateTagName(tagname) {
  return isName(tagname);
}
function getLineNumberForPosition(xmlData, index) {
  const lines = xmlData.substring(0, index).split(/\r?\n/);
  return {
    line: lines.length,
    // column number is last line's length + 1, because column numbering starts at 1:
    col: lines[lines.length - 1].length + 1
  };
}
function getPositionFromMatch(match) {
  return match.startIndex + match[1].length;
}
var defaultOptions, doubleQuote, singleQuote;
var init_validator = __esm({
  "node_modules/fast-xml-parser/src/validator.js"() {
    "use strict";
    init_util();
    defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    doubleQuote = '"';
    singleQuote = "'";
  }
});

// node_modules/@nodable/entities/src/entities.js
var CURRENCY, XML, COMMON_HTML;
var init_entities = __esm({
  "node_modules/@nodable/entities/src/entities.js"() {
    CURRENCY = {
      cent: "\xA2",
      pound: "\xA3",
      curren: "\xA4",
      yen: "\xA5",
      euro: "\u20AC",
      dollar: "$",
      fnof: "\u0192",
      inr: "\u20B9",
      af: "\u060B",
      birr: "\u1265\u122D",
      peso: "\u20B1",
      rub: "\u20BD",
      won: "\u20A9",
      yuan: "\xA5",
      cedil: "\xB8"
    };
    XML = {
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      quot: '"'
    };
    COMMON_HTML = {
      nbsp: "\xA0",
      copy: "\xA9",
      reg: "\xAE",
      trade: "\u2122",
      mdash: "\u2014",
      ndash: "\u2013",
      hellip: "\u2026",
      laquo: "\xAB",
      raquo: "\xBB",
      lsquo: "\u2018",
      rsquo: "\u2019",
      ldquo: "\u201C",
      rdquo: "\u201D",
      bull: "\u2022",
      para: "\xB6",
      sect: "\xA7",
      deg: "\xB0",
      frac12: "\xBD",
      frac14: "\xBC",
      frac34: "\xBE"
    };
  }
});

// node_modules/@nodable/entities/src/EntityDecoder.js
function validateEntityName(name) {
  if (name[0] === "#") {
    throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${name}"`);
  }
  for (const ch of name) {
    if (SPECIAL_CHARS.has(ch)) {
      throw new Error(`[EntityReplacer] Invalid character '${ch}' in entity name: "${name}"`);
    }
  }
  return name;
}
function mergeEntityMaps(...maps) {
  const out = /* @__PURE__ */ Object.create(null);
  for (const map of maps) {
    if (!map) continue;
    for (const key of Object.keys(map)) {
      const raw = map[key];
      if (typeof raw === "string") {
        out[key] = raw;
      } else if (raw && typeof raw === "object" && raw.val !== void 0) {
        const val = raw.val;
        if (typeof val === "string") {
          out[key] = val;
        }
      }
    }
  }
  return out;
}
function parseLimitTiers(raw) {
  if (!raw || raw === LIMIT_TIER_EXTERNAL) return /* @__PURE__ */ new Set([LIMIT_TIER_EXTERNAL]);
  if (raw === LIMIT_TIER_ALL) return /* @__PURE__ */ new Set([LIMIT_TIER_ALL]);
  if (raw === LIMIT_TIER_BASE) return /* @__PURE__ */ new Set([LIMIT_TIER_BASE]);
  if (Array.isArray(raw)) return new Set(raw);
  return /* @__PURE__ */ new Set([LIMIT_TIER_EXTERNAL]);
}
function parseNCRConfig(ncr) {
  if (!ncr) {
    return { xmlVersion: 1, onLevel: NCR_LEVEL.allow, nullLevel: NCR_LEVEL.remove };
  }
  const xmlVersion = ncr.xmlVersion === 1.1 ? 1.1 : 1;
  const onLevel = NCR_LEVEL[ncr.onNCR] ?? NCR_LEVEL.allow;
  const nullLevel = NCR_LEVEL[ncr.nullNCR] ?? NCR_LEVEL.remove;
  const clampedNull = Math.max(nullLevel, NCR_LEVEL.remove);
  return { xmlVersion, onLevel, nullLevel: clampedNull };
}
var ENTITY_ACTION, SPECIAL_CHARS, LIMIT_TIER_EXTERNAL, LIMIT_TIER_BASE, LIMIT_TIER_ALL, NCR_LEVEL, XML10_ALLOWED_C0, EntityDecoder;
var init_EntityDecoder = __esm({
  "node_modules/@nodable/entities/src/EntityDecoder.js"() {
    init_entities();
    ENTITY_ACTION = Object.freeze({
      /** Resolve and expand the entity normally. */
      ALLOW: "allow",
      /** Silently skip this entity — it will not be registered. */
      BLOCK: "block",
      /** Throw an error, aborting entity registration entirely. */
      THROW: "throw"
    });
    SPECIAL_CHARS = new Set("!?\\\\/[]$%{}^&*()<>|+");
    LIMIT_TIER_EXTERNAL = "external";
    LIMIT_TIER_BASE = "base";
    LIMIT_TIER_ALL = "all";
    NCR_LEVEL = Object.freeze({ allow: 0, leave: 1, remove: 2, throw: 3 });
    XML10_ALLOWED_C0 = /* @__PURE__ */ new Set([9, 10, 13]);
    EntityDecoder = class {
      /**
       * @param {object} [options]
       * @param {object|null}  [options.namedEntities]        — extra named entities merged into base map
       * @param {object}  [options.limit]                 — security limits
       * @param {number}       [options.limit.maxTotalExpansions=0]  — 0 = unlimited
       * @param {number}       [options.limit.maxExpandedLength=0]   — 0 = unlimited
       * @param {'external'|'base'|'all'|string[]} [options.limit.applyLimitsTo='external']
       *   Which entity tiers count against the security limits:
       *   - 'external' (default) — only input/runtime + persistent external entities
       *   - 'base'               — only DEFAULT_XML_ENTITIES + namedEntities
       *   - 'all'                — every entity regardless of tier
       *   - string[]             — explicit combination, e.g. ['external', 'base']
       * @param {((resolved: string, original: string) => string)|null} [options.postCheck=null]
       * @param {string[]} [options.remove=[]] — entity names (e.g. ['nbsp', '#13']) to delete (replace with empty string)
       * @param {string[]} [options.leave=[]]  — entity names to keep as literal (unchanged in output)
       * @param {object}   [options.ncr]       — Numeric Character Reference controls
       * @param {1.0|1.1}  [options.ncr.xmlVersion=1.0]
       *   XML version governing which codepoint ranges are restricted:
       *   - 1.0 — C0 controls U+0001–U+001F (except U+0009/000A/000D) are prohibited
       *   - 1.1 — C0 controls are allowed when written as NCRs; C1 (U+007F–U+009F) decoded as-is
       * @param {'allow'|'leave'|'remove'|'throw'} [options.ncr.onNCR='allow']
       *   Base action for numeric references. Severity order: allow < leave < remove < throw.
       *   For codepoint ranges that carry a minimum level (surrogates → remove, XML 1.0 C0 → remove),
       *   the effective action is max(onNCR, rangeMinimum).
       * @param {'remove'|'throw'} [options.ncr.nullNCR='remove']
       *   Action for U+0000 (null). 'allow' and 'leave' are clamped to 'remove' since null is never safe.
       * @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} [options.onExternalEntity=null]
       *   Hook called when an external entity is registered via `setExternalEntities()` or
       *   `addExternalEntity()`. Return `ENTITY_ACTION.ALLOW` to accept the entity,
       *   `ENTITY_ACTION.BLOCK` to silently skip it, or `ENTITY_ACTION.THROW` to abort with an error.
       * @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} [options.onInputEntity=null]
       *   Hook called when an input entity is registered via `addInputEntities()`. Return
       *   `ENTITY_ACTION.ALLOW` to accept, `ENTITY_ACTION.BLOCK` to silently skip, or
       *   `ENTITY_ACTION.THROW` to abort with an error.
       */
      constructor(options = {}) {
        this._limit = options.limit || {};
        this._maxTotalExpansions = this._limit.maxTotalExpansions || 0;
        this._maxExpandedLength = this._limit.maxExpandedLength || 0;
        this._postCheck = typeof options.postCheck === "function" ? options.postCheck : (r) => r;
        this._limitTiers = parseLimitTiers(this._limit.applyLimitsTo ?? LIMIT_TIER_EXTERNAL);
        this._numericAllowed = options.numericAllowed ?? true;
        this._baseMap = mergeEntityMaps(XML, options.namedEntities || null);
        this._externalMap = /* @__PURE__ */ Object.create(null);
        this._inputMap = /* @__PURE__ */ Object.create(null);
        this._totalExpansions = 0;
        this._expandedLength = 0;
        this._removeSet = new Set(options.remove && Array.isArray(options.remove) ? options.remove : []);
        this._leaveSet = new Set(options.leave && Array.isArray(options.leave) ? options.leave : []);
        const ncrCfg = parseNCRConfig(options.ncr);
        this._ncrXmlVersion = ncrCfg.xmlVersion;
        this._ncrOnLevel = ncrCfg.onLevel;
        this._ncrNullLevel = ncrCfg.nullLevel;
        this._onExternalEntity = typeof options.onExternalEntity === "function" ? options.onExternalEntity : null;
        this._onInputEntity = typeof options.onInputEntity === "function" ? options.onInputEntity : null;
      }
      // -------------------------------------------------------------------------
      // Private: registration hook dispatch
      // -------------------------------------------------------------------------
      /**
       * Invoke a registration hook for a single entity name/value pair.
       * Returns true when the entity should be accepted, false when it should be
       * silently skipped (BLOCK), and throws when the hook returns THROW.
       *
       * @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} hook
       * @param {string} name
       * @param {string} value
       * @param {string} context  — used in error messages ('external' | 'input')
       * @returns {boolean}  true = accept, false = skip
       */
      _applyRegistrationHook(hook, name, value, context) {
        if (!hook) return true;
        const action = hook(name, value);
        if (action === ENTITY_ACTION.BLOCK) return false;
        if (action === ENTITY_ACTION.THROW) {
          throw new Error(
            `[EntityDecoder] Registration of ${context} entity "&${name};" was rejected by hook`
          );
        }
        return true;
      }
      // -------------------------------------------------------------------------
      // Persistent external entity registration
      // -------------------------------------------------------------------------
      /**
       * Replace the full set of persistent external entities.
       * All keys are validated — throws on invalid characters.
       * If `onExternalEntity` is set, it is called once per entry; entries that
       * return `ENTITY_ACTION.BLOCK` are silently omitted, `ENTITY_ACTION.THROW`
       * aborts the whole call.
       * @param {Record<string, string | { regex?: RegExp, val: string }>} map
       */
      setExternalEntities(map) {
        if (map) {
          for (const key of Object.keys(map)) {
            validateEntityName(key);
          }
        }
        if (!this._onExternalEntity) {
          this._externalMap = mergeEntityMaps(map);
          return;
        }
        const flat = mergeEntityMaps(map);
        const filtered = /* @__PURE__ */ Object.create(null);
        for (const [name, value] of Object.entries(flat)) {
          if (this._applyRegistrationHook(this._onExternalEntity, name, value, "external")) {
            filtered[name] = value;
          }
        }
        this._externalMap = filtered;
      }
      /**
       * Add a single persistent external entity.
       * If `onExternalEntity` is set it is called before the entity is stored;
       * `ENTITY_ACTION.BLOCK` silently skips storage, `ENTITY_ACTION.THROW` raises.
       * @param {string} key
       * @param {string} value
       */
      addExternalEntity(key, value) {
        validateEntityName(key);
        if (typeof value === "string" && value.indexOf("&") === -1) {
          if (this._applyRegistrationHook(this._onExternalEntity, key, value, "external")) {
            this._externalMap[key] = value;
          }
        }
      }
      // -------------------------------------------------------------------------
      // Input / runtime entity registration (per document)
      // -------------------------------------------------------------------------
      /**
       * Inject DOCTYPE entities for the current document.
       * Also resets per-document expansion counters.
       * If `onInputEntity` is set it is called once per entry; entries returning
       * `ENTITY_ACTION.BLOCK` are silently omitted, `ENTITY_ACTION.THROW` aborts.
       * @param {Record<string, string | { regx?: RegExp, regex?: RegExp, val: string }>} map
       */
      addInputEntities(map) {
        this._totalExpansions = 0;
        this._expandedLength = 0;
        if (!this._onInputEntity) {
          this._inputMap = mergeEntityMaps(map);
          return;
        }
        const flat = mergeEntityMaps(map);
        const filtered = /* @__PURE__ */ Object.create(null);
        for (const [name, value] of Object.entries(flat)) {
          if (this._applyRegistrationHook(this._onInputEntity, name, value, "input")) {
            filtered[name] = value;
          }
        }
        this._inputMap = filtered;
      }
      // -------------------------------------------------------------------------
      // Per-document reset
      // -------------------------------------------------------------------------
      /**
       * Wipe input/runtime entities and reset counters.
       * Call this before processing each new document.
       * @returns {this}
       */
      reset() {
        this._inputMap = /* @__PURE__ */ Object.create(null);
        this._totalExpansions = 0;
        this._expandedLength = 0;
        return this;
      }
      // -------------------------------------------------------------------------
      // XML version (can be set after construction, e.g. once parser reads <?xml?>)
      // -------------------------------------------------------------------------
      /**
       * Update the XML version used for NCR classification.
       * Call this as soon as the document's `<?xml version="...">` declaration is parsed.
       * @param {1.0|1.1|number} version
       */
      setXmlVersion(version) {
        this._ncrXmlVersion = version === 1.1 ? 1.1 : 1;
      }
      // -------------------------------------------------------------------------
      // Primary API
      // -------------------------------------------------------------------------
      /**
       * Replace all entity references in `str` in a single pass.
       *
       * @param {string} str
       * @returns {string}
       */
      decode(str) {
        if (typeof str !== "string" || str.length === 0) return str;
        if (str.indexOf("&") === -1) return str;
        const original = str;
        const chunks = [];
        const len = str.length;
        let last = 0;
        let i = 0;
        const limitExpansions = this._maxTotalExpansions > 0;
        const limitLength = this._maxExpandedLength > 0;
        const checkLimits = limitExpansions || limitLength;
        while (i < len) {
          if (str.charCodeAt(i) !== 38) {
            i++;
            continue;
          }
          let j = i + 1;
          while (j < len && str.charCodeAt(j) !== 59 && j - i <= 32) j++;
          if (j >= len || str.charCodeAt(j) !== 59) {
            i++;
            continue;
          }
          const token = str.slice(i + 1, j);
          if (token.length === 0) {
            i++;
            continue;
          }
          let replacement;
          let tier;
          if (this._removeSet.has(token)) {
            replacement = "";
            if (tier === void 0) {
              tier = LIMIT_TIER_EXTERNAL;
            }
          } else if (this._leaveSet.has(token)) {
            i++;
            continue;
          } else if (token.charCodeAt(0) === 35) {
            const ncrResult = this._resolveNCR(token);
            if (ncrResult === void 0) {
              i++;
              continue;
            }
            replacement = ncrResult;
            tier = LIMIT_TIER_BASE;
          } else {
            const resolved = this._resolveName(token);
            replacement = resolved?.value;
            tier = resolved?.tier;
          }
          if (replacement === void 0) {
            i++;
            continue;
          }
          if (i > last) chunks.push(str.slice(last, i));
          chunks.push(replacement);
          last = j + 1;
          i = last;
          if (checkLimits && this._tierCounts(tier)) {
            if (limitExpansions) {
              this._totalExpansions++;
              if (this._totalExpansions > this._maxTotalExpansions) {
                throw new Error(
                  `[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`
                );
              }
            }
            if (limitLength) {
              const delta = replacement.length - (token.length + 2);
              if (delta > 0) {
                this._expandedLength += delta;
                if (this._expandedLength > this._maxExpandedLength) {
                  throw new Error(
                    `[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`
                  );
                }
              }
            }
          }
        }
        if (last < len) chunks.push(str.slice(last));
        const result = chunks.length === 0 ? str : chunks.join("");
        return this._postCheck(result, original);
      }
      // -------------------------------------------------------------------------
      // Private: limit tier check
      // -------------------------------------------------------------------------
      /**
       * Returns true if a resolved entity of the given tier should count
       * against the expansion/length limits.
       * @param {string} tier  — LIMIT_TIER_EXTERNAL | LIMIT_TIER_BASE
       * @returns {boolean}
       */
      _tierCounts(tier) {
        if (this._limitTiers.has(LIMIT_TIER_ALL)) return true;
        return this._limitTiers.has(tier);
      }
      // -------------------------------------------------------------------------
      // Private: entity resolution
      // -------------------------------------------------------------------------
      /**
       * Resolve a named entity token (without & and ;).
       * Priority: inputMap > externalMap > baseMap
       * Returns the resolved value tagged with its limit tier.
       *
       * @param {string} name
       * @returns {{ value: string, tier: string }|undefined}
       */
      _resolveName(name) {
        if (name in this._inputMap) return { value: this._inputMap[name], tier: LIMIT_TIER_EXTERNAL };
        if (name in this._externalMap) return { value: this._externalMap[name], tier: LIMIT_TIER_EXTERNAL };
        if (name in this._baseMap) return { value: this._baseMap[name], tier: LIMIT_TIER_BASE };
        return void 0;
      }
      /**
       * Classify a codepoint and return the minimum action level that must be applied.
       * Returns -1 when no minimum is imposed (normal allow path).
       *
       * Ranges checked (in priority order):
       *   1. U+0000            — null, governed by nullNCR (always ≥ remove)
       *   2. U+D800–U+DFFF     — surrogates, always prohibited (min: remove)
       *   3. U+0001–U+001F \ {0x09,0x0A,0x0D}  — XML 1.0 restricted C0 (min: remove)
       *      (skipped in XML 1.1 — C0 controls are allowed when written as NCRs)
       *
       * @param {number} cp  — codepoint
       * @returns {number}   — minimum NCR_LEVEL value, or -1 for no restriction
       */
      _classifyNCR(cp) {
        if (cp === 0) return this._ncrNullLevel;
        if (cp >= 55296 && cp <= 57343) return NCR_LEVEL.remove;
        if (this._ncrXmlVersion === 1) {
          if (cp >= 1 && cp <= 31 && !XML10_ALLOWED_C0.has(cp)) return NCR_LEVEL.remove;
        }
        return -1;
      }
      /**
       * Execute a resolved NCR action.
       *
       * @param {number} action   — NCR_LEVEL value
       * @param {string} token    — raw token (e.g. '#38') for error messages
       * @param {number} cp       — codepoint, used only for error messages
       * @returns {string|undefined}
       *   - decoded character string  → 'allow'
       *   - ''                        → 'remove'
       *   - undefined                 → 'leave' (caller must skip past '&' only)
       *   - throws Error              → 'throw'
       */
      _applyNCRAction(action, token, cp) {
        switch (action) {
          case NCR_LEVEL.allow:
            return String.fromCodePoint(cp);
          case NCR_LEVEL.remove:
            return "";
          case NCR_LEVEL.leave:
            return void 0;
          // signal: keep literal
          case NCR_LEVEL.throw:
            throw new Error(
              `[EntityDecoder] Prohibited numeric character reference &${token}; (U+${cp.toString(16).toUpperCase().padStart(4, "0")})`
            );
          default:
            return String.fromCodePoint(cp);
        }
      }
      /**
       * Full NCR resolution pipeline for a numeric token.
       *
       * Steps:
       *   1. Parse the codepoint (decimal or hex).
       *   2. Validate the raw codepoint range (NaN, <0, >0x10FFFF).
       *   3. If numericAllowed is false and no minimum restriction applies → leave as-is.
       *   4. Classify the codepoint to find the minimum required action level.
       *   5. Resolve effective action = max(onNCR, minimum).
       *   6. Apply and return.
       *
       * @param {string} token  — e.g. '#38', '#x26', '#X26'
       * @returns {string|undefined}
       *   - string (incl. '')  — replacement ('' = remove)
       *   - undefined          — leave original &token; as-is
       */
      _resolveNCR(token) {
        const second = token.charCodeAt(1);
        let cp;
        if (second === 120 || second === 88) {
          cp = parseInt(token.slice(2), 16);
        } else {
          cp = parseInt(token.slice(1), 10);
        }
        if (Number.isNaN(cp) || cp < 0 || cp > 1114111) return void 0;
        const minimum = this._classifyNCR(cp);
        if (!this._numericAllowed && minimum < NCR_LEVEL.remove) return void 0;
        const effective = minimum === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, minimum);
        return this._applyNCRAction(effective, token, cp);
      }
    };
  }
});

// node_modules/@nodable/entities/src/index.js
var init_src = __esm({
  "node_modules/@nodable/entities/src/index.js"() {
    init_EntityDecoder();
    init_entities();
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
function validatePropertyName(propertyName, optionName) {
  if (typeof propertyName !== "string") {
    return;
  }
  const normalized = propertyName.toLowerCase();
  if (DANGEROUS_PROPERTY_NAMES.some((dangerous) => normalized === dangerous.toLowerCase())) {
    throw new Error(
      `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
  }
  if (criticalProperties.some((dangerous) => normalized === dangerous.toLowerCase())) {
    throw new Error(
      `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
  }
}
function normalizeProcessEntities(value, htmlEntities) {
  if (typeof value === "boolean") {
    return {
      enabled: value,
      // true or false
      maxEntitySize: 1e4,
      maxExpansionDepth: 1e4,
      maxTotalExpansions: Infinity,
      maxExpandedLength: 1e5,
      maxEntityCount: 1e3,
      allowedTags: null,
      tagFilter: null,
      appliesTo: "all"
    };
  }
  if (typeof value === "object" && value !== null) {
    return {
      enabled: value.enabled !== false,
      maxEntitySize: Math.max(1, value.maxEntitySize ?? 1e4),
      maxExpansionDepth: Math.max(1, value.maxExpansionDepth ?? 1e4),
      maxTotalExpansions: Math.max(1, value.maxTotalExpansions ?? Infinity),
      maxExpandedLength: Math.max(1, value.maxExpandedLength ?? 1e5),
      maxEntityCount: Math.max(1, value.maxEntityCount ?? 1e3),
      allowedTags: value.allowedTags ?? null,
      tagFilter: value.tagFilter ?? null,
      appliesTo: value.appliesTo ?? "all"
    };
  }
  return normalizeProcessEntities(true);
}
var defaultOnDangerousProperty, defaultOptions2, buildOptions;
var init_OptionsBuilder = __esm({
  "node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"() {
    init_util();
    defaultOnDangerousProperty = (name) => {
      if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
        return "__" + name;
      }
      return name;
    };
    defaultOptions2 = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true,
        unicode: false
      },
      tagValueProcessor: function(tagName, val) {
        return val;
      },
      attributeValueProcessor: function(attrName, val) {
        return val;
      },
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      entityDecoder: null,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: function(tagName, jPath, attrs) {
        return tagName;
      },
      // skipEmptyListItem: false
      captureMetaData: false,
      maxNestedTags: 100,
      strictReservedNames: true,
      jPath: true,
      // if true, pass jPath string to callbacks; if false, pass matcher instance
      onDangerousProperty: defaultOnDangerousProperty
    };
    buildOptions = function(options) {
      const built = Object.assign({}, defaultOptions2, options);
      const propertyNameOptions = [
        { value: built.attributeNamePrefix, name: "attributeNamePrefix" },
        { value: built.attributesGroupName, name: "attributesGroupName" },
        { value: built.textNodeName, name: "textNodeName" },
        { value: built.cdataPropName, name: "cdataPropName" },
        { value: built.commentPropName, name: "commentPropName" }
      ];
      for (const { value, name } of propertyNameOptions) {
        if (value) {
          validatePropertyName(value, name);
        }
      }
      if (built.onDangerousProperty === null) {
        built.onDangerousProperty = defaultOnDangerousProperty;
      }
      built.processEntities = normalizeProcessEntities(built.processEntities, built.htmlEntities);
      built.unpairedTagsSet = new Set(built.unpairedTags);
      if (built.stopNodes && Array.isArray(built.stopNodes)) {
        built.stopNodes = built.stopNodes.map((node) => {
          if (typeof node === "string" && node.startsWith("*.")) {
            return ".." + node.substring(2);
          }
          return node;
        });
      }
      return built;
    };
  }
});

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var METADATA_SYMBOL, XmlNode;
var init_xmlNode = __esm({
  "node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"() {
    "use strict";
    if (typeof Symbol !== "function") {
      METADATA_SYMBOL = "@@xmlMetadata";
    } else {
      METADATA_SYMBOL = /* @__PURE__ */ Symbol("XML Node Metadata");
    }
    XmlNode = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = /* @__PURE__ */ Object.create(null);
      }
      add(key, val) {
        if (key === "__proto__") key = "#__proto__";
        this.child.push({ [key]: val });
      }
      addChild(node, startIndex) {
        if (node.tagname === "__proto__") node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
        this.addStartIndex(startIndex);
      }
      addStartIndex(startIndex) {
        if (startIndex !== void 0) {
          this.child[this.child.length - 1][METADATA_SYMBOL] = { startIndex };
        }
      }
      addEndIndex(endIndex) {
        const lastChild = this.child[this.child.length - 1];
        if (lastChild !== void 0 && lastChild[METADATA_SYMBOL] !== void 0 && lastChild[METADATA_SYMBOL].endIndex === void 0) {
          lastChild[METADATA_SYMBOL].endIndex = endIndex;
        }
      }
      /** symbol used for metadata */
      static getMetaDataSymbol() {
        return METADATA_SYMBOL;
      }
    };
  }
});

// node_modules/xml-naming/src/index.js
var nameStartChar10, nameChar10, nameStartChar11, nameChar11, buildRegexes, regexes10, regexes11, nameStartCharAscii, nameCharAscii, regexesAscii, getRegexes, qName;
var init_src2 = __esm({
  "node_modules/xml-naming/src/index.js"() {
    nameStartChar10 = ":A-Za-z_\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u0486\u0488-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD";
    nameChar10 = nameStartChar10 + "\\-\\.\\d\xB7\u0300-\u036F\u203F-\u2040";
    nameStartChar11 = ":A-Za-z_\xC0-\u02FF\u0370-\u037D\u037F-\u0486\u0488-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}";
    nameChar11 = nameStartChar11 + "\\-\\.\\d\xB7\u0300-\u036F\u0487\u203F-\u2040";
    buildRegexes = (startChar, char, flags = "") => {
      const ncStart = startChar.replace(":", "");
      const ncChar = char.replace(":", "");
      const ncNamePat = `[${ncStart}][${ncChar}]*`;
      return {
        name: new RegExp(`^[${startChar}][${char}]*$`, flags),
        ncName: new RegExp(`^${ncNamePat}$`, flags),
        qName: new RegExp(`^${ncNamePat}(?::${ncNamePat})?$`, flags),
        nmToken: new RegExp(`^[${char}]+$`, flags),
        nmTokens: new RegExp(`^[${char}]+(?:\\s+[${char}]+)*$`, flags)
      };
    };
    regexes10 = buildRegexes(nameStartChar10, nameChar10);
    regexes11 = buildRegexes(nameStartChar11, nameChar11, "u");
    nameStartCharAscii = ":A-Za-z_";
    nameCharAscii = nameStartCharAscii + "\\-\\.\\d";
    regexesAscii = buildRegexes(nameStartCharAscii, nameCharAscii);
    getRegexes = (xmlVersion = "1.0", asciiOnly = false) => {
      if (asciiOnly) return regexesAscii;
      return xmlVersion === "1.1" ? regexes11 : regexes10;
    };
    qName = (str, { xmlVersion = "1.0", asciiOnly = false } = {}) => getRegexes(xmlVersion, asciiOnly).qName.test(str);
  }
});

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
function hasSeq(data, seq, i) {
  for (let j = 0; j < seq.length; j++) {
    if (seq[j] !== data[i + j + 1]) return false;
  }
  return true;
}
function validateEntityName2(name, xmlVersion) {
  if (qName(name, { xmlVersion }))
    return name;
  else
    throw new Error(`Invalid entity name ${name}`);
}
var DocTypeReader, skipWhitespace;
var init_DocTypeReader = __esm({
  "node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"() {
    init_src2();
    DocTypeReader = class {
      constructor(options, xmlVersion) {
        this.suppressValidationErr = !options;
        this.options = options;
        this.xmlVersion = xmlVersion || 1;
      }
      setXmlVersion(xmlVersion = 1) {
        this.xmlVersion = xmlVersion;
      }
      readDocType(xmlData, i) {
        const entities = /* @__PURE__ */ Object.create(null);
        let entityCount = 0;
        if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
          i = i + 9;
          let angleBracketsCount = 1;
          let hasBody = false, comment = false;
          let quoteChar = null;
          let exp = "";
          for (; i < xmlData.length; i++) {
            if (quoteChar !== null) {
              if (xmlData[i] === quoteChar) quoteChar = null;
              exp += xmlData[i];
              continue;
            }
            if (!hasBody && !comment && (xmlData[i] === '"' || xmlData[i] === "'")) {
              quoteChar = xmlData[i];
              exp += xmlData[i];
              continue;
            }
            if (xmlData[i] === "<" && !comment) {
              if (hasBody && hasSeq(xmlData, "!ENTITY", i)) {
                i += 7;
                let entityName, val;
                [entityName, val, i] = this.readEntityExp(xmlData, i + 1, this.suppressValidationErr);
                if (val.indexOf("&") === -1) {
                  if (this.options.enabled !== false && this.options.maxEntityCount != null && entityCount >= this.options.maxEntityCount) {
                    throw new Error(
                      `Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`
                    );
                  }
                  entities[entityName] = val;
                  entityCount++;
                }
              } else if (hasBody && hasSeq(xmlData, "!ELEMENT", i)) {
                i += 8;
                const { index } = this.readElementExp(xmlData, i + 1);
                i = index;
              } else if (hasBody && hasSeq(xmlData, "!ATTLIST", i)) {
                i += 8;
              } else if (hasBody && hasSeq(xmlData, "!NOTATION", i)) {
                i += 9;
                const { index } = this.readNotationExp(xmlData, i + 1, this.suppressValidationErr);
                i = index;
              } else if (hasSeq(xmlData, "!--", i)) comment = true;
              else throw new Error(`Invalid DOCTYPE`);
              angleBracketsCount++;
              exp = "";
            } else if (xmlData[i] === ">") {
              if (comment) {
                if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
                  comment = false;
                  angleBracketsCount--;
                }
              } else {
                angleBracketsCount--;
              }
              if (angleBracketsCount === 0) {
                break;
              }
            } else if (xmlData[i] === "[") {
              hasBody = true;
            } else {
              exp += xmlData[i];
            }
          }
          if (quoteChar !== null || angleBracketsCount !== 0) {
            throw new Error(`Unclosed DOCTYPE`);
          }
        } else {
          throw new Error(`Invalid Tag instead of DOCTYPE`);
        }
        return { entities, i };
      }
      readEntityExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        const startIndex = i;
        while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== '"' && xmlData[i] !== "'") {
          i++;
        }
        let entityName = xmlData.substring(startIndex, i);
        validateEntityName2(entityName, { xmlVersion: this.xmlVersion });
        i = skipWhitespace(xmlData, i);
        if (!this.suppressValidationErr) {
          if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") {
            throw new Error("External entities are not supported");
          } else if (xmlData[i] === "%") {
            throw new Error("Parameter entities are not supported");
          }
        }
        let entityValue = "";
        [i, entityValue] = this.readIdentifierVal(xmlData, i, "entity");
        if (this.options.enabled !== false && this.options.maxEntitySize != null && entityValue.length > this.options.maxEntitySize) {
          throw new Error(
            `Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`
          );
        }
        i--;
        return [entityName, entityValue, i];
      }
      readNotationExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        const startIndex = i;
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          i++;
        }
        let notationName = xmlData.substring(startIndex, i);
        !this.suppressValidationErr && validateEntityName2(notationName, { xmlVersion: this.xmlVersion });
        i = skipWhitespace(xmlData, i);
        const identifierType = xmlData.substring(i, i + 6).toUpperCase();
        if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
          throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
        }
        i += identifierType.length;
        i = skipWhitespace(xmlData, i);
        let publicIdentifier = null;
        let systemIdentifier = null;
        if (identifierType === "PUBLIC") {
          [i, publicIdentifier] = this.readIdentifierVal(xmlData, i, "publicIdentifier");
          i = skipWhitespace(xmlData, i);
          if (xmlData[i] === '"' || xmlData[i] === "'") {
            [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
          }
        } else if (identifierType === "SYSTEM") {
          [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
          if (!this.suppressValidationErr && !systemIdentifier) {
            throw new Error("Missing mandatory system identifier for SYSTEM notation");
          }
        }
        return { notationName, publicIdentifier, systemIdentifier, index: --i };
      }
      readIdentifierVal(xmlData, i, type) {
        let identifierVal = "";
        const startChar = xmlData[i];
        if (startChar !== '"' && startChar !== "'") {
          throw new Error(`Expected quoted string, found "${startChar}"`);
        }
        i++;
        const startIndex = i;
        while (i < xmlData.length && xmlData[i] !== startChar) {
          i++;
        }
        identifierVal = xmlData.substring(startIndex, i);
        if (xmlData[i] !== startChar) {
          throw new Error(`Unterminated ${type} value`);
        }
        i++;
        return [i, identifierVal];
      }
      readElementExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        const startIndex = i;
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          i++;
        }
        let elementName = xmlData.substring(startIndex, i);
        if (!this.suppressValidationErr && !qName(elementName, { xmlVersion: this.xmlVersion })) {
          throw new Error(`Invalid element name: "${elementName}"`);
        }
        i = skipWhitespace(xmlData, i);
        let contentModel = "";
        if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) i += 4;
        else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) i += 2;
        else if (xmlData[i] === "(") {
          i++;
          const startIndex2 = i;
          while (i < xmlData.length && xmlData[i] !== ")") {
            i++;
          }
          contentModel = xmlData.substring(startIndex2, i);
          if (xmlData[i] !== ")") {
            throw new Error("Unterminated content model");
          }
        } else if (!this.suppressValidationErr) {
          throw new Error(`Invalid Element Expression, found "${xmlData[i]}"`);
        }
        return {
          elementName,
          contentModel: contentModel.trim(),
          index: i
        };
      }
      readAttlistExp(xmlData, i) {
        i = skipWhitespace(xmlData, i);
        let startIndex = i;
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          i++;
        }
        let elementName = xmlData.substring(startIndex, i);
        validateEntityName2(elementName, { xmlVersion: this.xmlVersion });
        i = skipWhitespace(xmlData, i);
        startIndex = i;
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          i++;
        }
        let attributeName = xmlData.substring(startIndex, i);
        if (!validateEntityName2(attributeName, { xmlVersion: this.xmlVersion })) {
          throw new Error(`Invalid attribute name: "${attributeName}"`);
        }
        i = skipWhitespace(xmlData, i);
        let attributeType = "";
        if (xmlData.substring(i, i + 8).toUpperCase() === "NOTATION") {
          attributeType = "NOTATION";
          i += 8;
          i = skipWhitespace(xmlData, i);
          if (xmlData[i] !== "(") {
            throw new Error(`Expected '(', found "${xmlData[i]}"`);
          }
          i++;
          let allowedNotations = [];
          while (i < xmlData.length && xmlData[i] !== ")") {
            const startIndex2 = i;
            while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") {
              i++;
            }
            let notation = xmlData.substring(startIndex2, i);
            notation = notation.trim();
            if (!validateEntityName2(notation, { xmlVersion: this.xmlVersion })) {
              throw new Error(`Invalid notation name: "${notation}"`);
            }
            allowedNotations.push(notation);
            if (xmlData[i] === "|") {
              i++;
              i = skipWhitespace(xmlData, i);
            }
          }
          if (xmlData[i] !== ")") {
            throw new Error("Unterminated list of notations");
          }
          i++;
          attributeType += " (" + allowedNotations.join("|") + ")";
        } else {
          const startIndex2 = i;
          while (i < xmlData.length && !/\s/.test(xmlData[i])) {
            i++;
          }
          attributeType += xmlData.substring(startIndex2, i);
          const validTypes = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
          if (!this.suppressValidationErr && !validTypes.includes(attributeType.toUpperCase())) {
            throw new Error(`Invalid attribute type: "${attributeType}"`);
          }
        }
        i = skipWhitespace(xmlData, i);
        let defaultValue = "";
        if (xmlData.substring(i, i + 8).toUpperCase() === "#REQUIRED") {
          defaultValue = "#REQUIRED";
          i += 8;
        } else if (xmlData.substring(i, i + 7).toUpperCase() === "#IMPLIED") {
          defaultValue = "#IMPLIED";
          i += 7;
        } else {
          [i, defaultValue] = this.readIdentifierVal(xmlData, i, "ATTLIST");
        }
        return {
          elementName,
          attributeName,
          attributeType,
          defaultValue,
          index: i
        };
      }
    };
    skipWhitespace = (data, index) => {
      while (index < data.length && /\s/.test(data[index])) {
        index++;
      }
      return index;
    };
  }
});

// node_modules/anynum/digitTable.js
var SCRIPT_ZEROS, NOT_DIGIT, HIGH_MAP, LOW_MAX, LOW_MIN, TABLE_OFFSET, TABLE_SIZE, TABLE;
var init_digitTable = __esm({
  "node_modules/anynum/digitTable.js"() {
    SCRIPT_ZEROS = [
      // Basic Latin (ASCII) — included for completeness / pass-through
      48,
      // 0-9
      // Arabic scripts
      1632,
      // Arabic-Indic ٠١٢٣٤٥٦٧٨٩
      1776,
      // Extended Arabic-Indic (Urdu/Persian/Sindhi) ۰۱۲۳
      // Indic scripts
      2406,
      // Devanagari ०१२३४५६७८९
      2534,
      // Bengali ০১২৩৪৫৬৭৮৯
      2662,
      // Gurmukhi ੦੧੨੩੪੫੬੭੮੯
      2790,
      // Gujarati ૦૧૨૩૪૫૬૭૮૯
      2918,
      // Odia ୦୧୨୩୪୫୬୭୮୯
      3046,
      // Tamil ௦௧௨௩௪௫௬௭௮௯
      3174,
      // Telugu ౦౧౨౩౪౫౬౭౮౯
      3302,
      // Kannada ೦೧೨೩೪೫೬೭೮೯
      3430,
      // Malayalam ൦൧൨൩൪൫൬൭൮൯
      3558,
      // Sinhala Archaic ෦෧෨෩෪෫෬෭෮෯
      // Southeast Asian scripts
      3664,
      // Thai ๐๑๒๓๔๕๖๗๘๙
      3792,
      // Lao ໐໑໒໓໔໕໖໗໘໙
      3872,
      // Tibetan ༠༡༢༣༤༥༦༧༨༩
      4160,
      // Myanmar ၀၁၂၃၄၅၆၇၈၉
      4240,
      // Myanmar Shan ႐႑႒႓႔႕႖႗႘႙
      6112,
      // Khmer ០១២៣៤៥៦៧៨៩
      6160,
      // Mongolian ᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙
      6470,
      // Limbu ᥆᥇᥈᥉᥊᥋᥌᥍᥎᥏
      6608,
      // New Tai Lue ᧐᧑᧒᧓᧔᧕᧖᧗᧘᧙
      6784,
      // Tai Tham Hora ᪀᪁᪂᪃᪄᪅᪆᪇᪈᪉
      6800,
      // Tai Tham Tham ᪐᪑᪒᪓᪔᪕᪖᪗᪘᪙
      6992,
      // Balinese ᭐᭑᭒᭓᭔᭕᭖᭗᭘᭙
      7088,
      // Sundanese ᮰᮱᮲᮳᮴᮵᮶᮷᮸᮹
      7232,
      // Lepcha ᱀᱁᱂᱃᱄᱅᱆᱇᱈᱉
      7248,
      // Ol Chiki ᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙
      // Fullwidth (CJK context)
      65296,
      // Fullwidth ０１２３４５６７８９
      // Mathematical digit variants (Unicode math block)
      120782,
      // Mathematical Bold
      120792,
      // Mathematical Double-Struck
      120802,
      // Mathematical Sans-Serif
      120812,
      // Mathematical Sans-Serif Bold
      120822,
      // Mathematical Monospace
      // Other scripts
      66720,
      // Osmanya 𐒠𐒡𐒢𐒣𐒤𐒥𐒦𐒧𐒨𐒩
      68912,
      // Hanifi Rohingya 𐴰𐴱𐴲𐴳𐴴𐴵𐴶𐴷𐴸𐴹
      69734,
      // Brahmi 𑁦𑁧𑁨𑁩𑁪𑁫𑁬𑁭𑁮𑁯
      69872,
      // Sora Sompeng 𑃰𑃱𑃲𑃳𑃴𑃵𑃶𑃷𑃸𑃹
      69942,
      // Chakma 𑄶𑄷𑄸𑄹𑄺𑄻𑄼𑄽𑄾𑄿
      70096,
      // Sharada 𑇐𑇑𑇒𑇓𑇔𑇕𑇖𑇗𑇘𑇙
      70384,
      // Khudawadi 𑋰𑋱𑋲𑋳𑋴𑋵𑋶𑋷𑋸𑋹
      70736,
      // Newa 𑑐𑑑𑑒𑑓𑑔𑑕𑑖𑑗𑑘𑑙
      70864,
      // Tirhuta 𑓐𑓑𑓒𑓓𑓔𑓕𑓖𑓗𑓘𑓙
      71248,
      // Modi 𑙐𑙑𑙒𑙓𑙔𑙕𑙖𑙗𑙘𑙙
      71360,
      // Takri 𑛀𑛁𑛂𑛃𑛄𑛅𑛆𑛇𑛈𑛉
      71472,
      // Ahom 𑜰𑜱𑜲𑜳𑜴𑜵𑜶𑜷𑜸𑜹
      71904,
      // Warang Citi 𑣠𑣡𑣢𑣣𑣤𑣥𑣦𑣧𑣨𑣩
      72016,
      // Dives Akuru 𑥐𑥑𑥒𑥓𑥔𑥕𑥖𑥗𑥘𑥙
      72688,
      // Khitan Small Script 𑯰𑯱𑯲𑯳𑯴𑯵𑯶𑯷𑯸𑯹
      72784,
      // Bhaiksuki 𑱐𑱑𑱒𑱓𑱔𑱕𑱖𑱗𑱘𑱙
      73040,
      // Masaram Gondi 𑵐𑵑𑵒𑵓𑵔𑵕𑵖𑵗𑵘𑵙
      73120,
      // Gunjala Gondi 𑶠𑶡𑶢𑶣𑶤𑶥𑶦𑶧𑶨𑶩
      73552,
      // Kawi 𑽐𑽑𑽒𑽓𑽔𑽕𑽖𑽗𑽘𑽙
      92768,
      // Mro 𖩠𖩡𖩢𖩣𖩤𖩥𖩦𖩧𖩨𖩩
      92864,
      // Tangsa 𖫀𖫁𖫂𖫃𖫄𖫅𖫆𖫇𖫈𖫉
      93008,
      // Pahawh Hmong 𖭐𖭑𖭒𖭓𖭔𖭕𖭖𖭗𖭘𖭙
      123200,
      // Nyiakeng Puachue Hmong 𞅀𞅁𞅂𞅃𞅄𞅅𞅆𞅇𞅈𞅉
      123632,
      // Wancho 𞋰𞋱𞋲𞋳𞋴𞋵𞋶𞋷𞋸𞋹
      124144,
      // Nag Mundari 𞓰𞓱𞓲𞓳𞓴𞓵𞓶𞓷𞓸𞓹
      125264,
      // Adlam 𞥐𞥑𞥒𞥓𞥔𞥕𞥖𞥗𞥘𞥙
      130032
      // Segmented digit symbols 🯰🯱🯲🯳🯴🯵🯶🯷🯸🯹
    ];
    NOT_DIGIT = 255;
    HIGH_MAP = /* @__PURE__ */ new Map();
    LOW_MAX = 65535;
    LOW_MIN = 1632;
    TABLE_OFFSET = LOW_MIN;
    TABLE_SIZE = LOW_MAX - LOW_MIN + 1;
    TABLE = new Uint8Array(TABLE_SIZE).fill(NOT_DIGIT);
    for (const zero of SCRIPT_ZEROS) {
      for (let d = 0; d < 10; d++) {
        const cp = zero + d;
        if (cp <= LOW_MAX) {
          TABLE[cp - TABLE_OFFSET] = d;
        } else {
          HIGH_MAP.set(cp, d);
        }
      }
    }
  }
});

// node_modules/anynum/anynum.js
function anynum(str) {
  if (typeof str !== "string") return str;
  const len = str.length;
  if (len === 0) return str;
  let firstHit = -1;
  for (let i = 0; i < len; i++) {
    const cc = str.charCodeAt(i);
    if (cc >= CHAR_0 && cc <= CHAR_9 || cc === CHAR_MINUS) continue;
    if (cc < TABLE_OFFSET) {
      if (MINUS_SET.has(cc)) {
        firstHit = i;
        break;
      }
      continue;
    }
    if (cc >= 55296 && cc <= 56319) {
      if (i + 1 < len) {
        const low = str.charCodeAt(i + 1);
        if (low >= 56320 && low <= 57343) {
          const cp = 65536 + (cc - 55296 << 10) + (low - 56320);
          if (HIGH_MAP.has(cp)) {
            firstHit = i;
            break;
          }
        }
      }
      continue;
    }
    if (TABLE[cc - TABLE_OFFSET] !== NOT_DIGIT || MINUS_SET.has(cc)) {
      firstHit = i;
      break;
    }
  }
  if (firstHit === -1) return str;
  const chars = [];
  if (firstHit > 0) chars.push(str.slice(0, firstHit));
  for (let i = firstHit; i < len; i++) {
    const cc = str.charCodeAt(i);
    if (cc >= CHAR_0 && cc <= CHAR_9 || cc === CHAR_MINUS) {
      chars.push(str[i]);
      continue;
    }
    if (cc < TABLE_OFFSET) {
      chars.push(MINUS_SET.has(cc) ? "-" : str[i]);
      continue;
    }
    if (cc >= 55296 && cc <= 56319) {
      if (i + 1 < len) {
        const low = str.charCodeAt(i + 1);
        if (low >= 56320 && low <= 57343) {
          const cp = 65536 + (cc - 55296 << 10) + (low - 56320);
          const d2 = HIGH_MAP.get(cp);
          if (d2 !== void 0) {
            chars.push(String.fromCharCode(d2 + 48));
            i++;
            continue;
          }
        }
      }
      chars.push(str[i]);
      continue;
    }
    if (MINUS_SET.has(cc)) {
      chars.push("-");
      continue;
    }
    const d = TABLE[cc - TABLE_OFFSET];
    chars.push(d !== NOT_DIGIT ? String.fromCharCode(d + 48) : str[i]);
  }
  return chars.join("");
}
var CHAR_0, CHAR_9, CHAR_MINUS, MINUS_SET, anynum_default;
var init_anynum = __esm({
  "node_modules/anynum/anynum.js"() {
    "use strict";
    init_digitTable();
    CHAR_0 = 48;
    CHAR_9 = 57;
    CHAR_MINUS = 45;
    MINUS_SET = /* @__PURE__ */ new Set([8722, 65293, 65123]);
    anynum_default = anynum;
  }
});

// node_modules/strnum/strnum.js
function toNumber(str, options = {}) {
  options = Object.assign({}, consider, options);
  if (!str || typeof str !== "string") return str;
  let trimmedStr = str.trim();
  if (trimmedStr.length === 0) return str;
  else if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
  else if (trimmedStr === "0") return 0;
  if (options.unicode) {
    trimmedStr = anynum_default(trimmedStr);
    if (trimmedStr === "0") return 0;
  }
  if (options.hex && hexRegex.test(trimmedStr)) {
    return parse_int(trimmedStr, 16);
  } else if (options.binary && binRegex.test(trimmedStr)) {
    return parse_int(trimmedStr, 2);
  } else if (options.octal && octRegex.test(trimmedStr)) {
    return parse_int(trimmedStr, 8);
  } else if (!isFinite(trimmedStr)) {
    return handleInfinity(str, Number(trimmedStr), options);
  } else if (trimmedStr.includes("e") || trimmedStr.includes("E")) {
    return resolveEnotation(str, trimmedStr, options);
  } else {
    const match = numRegex.exec(trimmedStr);
    if (match) {
      const sign = match[1] || "";
      const leadingZeros = match[2];
      let numTrimmedByZeros = trimZeros(match[3]);
      const decimalAdjacentToLeadingZeros = sign ? (
        // 0., -00., 000.
        str[leadingZeros.length + 1] === "."
      ) : str[leadingZeros.length] === ".";
      if (!options.leadingZeros && (leadingZeros.length > 1 || leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros)) {
        return str;
      } else {
        const num = Number(trimmedStr);
        const parsedStr = String(num);
        if (num === 0) return num;
        if (parsedStr.search(/[eE]/) !== -1) {
          if (options.eNotation) return num;
          else return str;
        } else if (trimmedStr.indexOf(".") !== -1) {
          if (parsedStr === "0") return num;
          else if (parsedStr === numTrimmedByZeros) return num;
          else if (parsedStr === `${sign}${numTrimmedByZeros}`) return num;
          else return str;
        }
        let n = leadingZeros ? numTrimmedByZeros : trimmedStr;
        if (leadingZeros) {
          return n === parsedStr || sign + n === parsedStr ? num : str;
        } else {
          return n === parsedStr || n === sign + parsedStr ? num : str;
        }
      }
    } else {
      return str;
    }
  }
}
function resolveEnotation(str, trimmedStr, options) {
  if (!options.eNotation) return str;
  const notation = trimmedStr.match(eNotationRegx);
  if (notation) {
    let sign = notation[1] || "";
    const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
    const leadingZeros = notation[2];
    const eAdjacentToLeadingZeros = sign ? (
      // 0E.
      str[leadingZeros.length + 1] === eChar
    ) : str[leadingZeros.length] === eChar;
    if (leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str;
    else if (leadingZeros.length === 1 && (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)) {
      return Number(trimmedStr);
    } else if (leadingZeros.length > 0) {
      if (options.leadingZeros && !eAdjacentToLeadingZeros) {
        trimmedStr = (notation[1] || "") + notation[3];
        return Number(trimmedStr);
      } else return str;
    } else {
      return Number(trimmedStr);
    }
  } else {
    return str;
  }
}
function trimZeros(numStr) {
  if (numStr && numStr.indexOf(".") !== -1) {
    let end = numStr.length;
    while (end > 0 && numStr.charCodeAt(end - 1) === 48) end--;
    numStr = numStr.slice(0, end);
    if (numStr === ".") numStr = "0";
    else if (numStr[0] === ".") numStr = "0" + numStr;
    else if (numStr[numStr.length - 1] === ".") numStr = numStr.substring(0, numStr.length - 1);
    return numStr;
  }
  return numStr;
}
function parse_int(numStr, base) {
  const str = numStr.trim();
  if (base === 2 || base === 8) numStr = str.substring(2);
  if (parseInt) return parseInt(numStr, base);
  else if (Number.parseInt) return Number.parseInt(numStr, base);
  else if (window && window.parseInt) return window.parseInt(numStr, base);
  else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
function handleInfinity(str, num, options) {
  const isPositive = num === Infinity;
  switch (options.infinity.toLowerCase()) {
    case "null":
      return null;
    case "infinity":
      return num;
    // Return Infinity or -Infinity
    case "string":
      return isPositive ? "Infinity" : "-Infinity";
    case "original":
    default:
      return str;
  }
}
var hexRegex, binRegex, octRegex, numRegex, consider, eNotationRegx;
var init_strnum = __esm({
  "node_modules/strnum/strnum.js"() {
    init_anynum();
    hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    binRegex = /^0b[01]+$/;
    octRegex = /^0o[0-7]+$/;
    numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
    consider = {
      hex: true,
      binary: false,
      octal: false,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true,
      //skipLike: /regex/,
      infinity: "original",
      // "null", "infinity" (Infinity type), "string" ("Infinity" (the string literal))
      unicode: false
    };
    eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
  }
});

// node_modules/fast-xml-parser/src/ignoreAttributes.js
function getIgnoreAttributesFn(ignoreAttributes) {
  if (typeof ignoreAttributes === "function") {
    return ignoreAttributes;
  }
  if (Array.isArray(ignoreAttributes)) {
    return (attrName) => {
      for (const pattern of ignoreAttributes) {
        if (typeof pattern === "string" && attrName === pattern) {
          return true;
        }
        if (pattern instanceof RegExp && pattern.test(attrName)) {
          return true;
        }
      }
    };
  }
  return () => false;
}
var init_ignoreAttributes = __esm({
  "node_modules/fast-xml-parser/src/ignoreAttributes.js"() {
  }
});

// node_modules/path-expression-matcher/src/Expression.js
var Expression;
var init_Expression = __esm({
  "node_modules/path-expression-matcher/src/Expression.js"() {
    Expression = class {
      /**
       * Create a new Expression
       * @param {string} pattern - Pattern string (e.g., "root.users.user", "..user[id]")
       * @param {Object} options - Configuration options
       * @param {string} options.separator - Path separator (default: '.')
       */
      constructor(pattern, options = {}, data) {
        this.pattern = pattern;
        this.separator = options.separator || ".";
        this.segments = this._parse(pattern);
        this.data = data;
        this._hasDeepWildcard = this.segments.some((seg) => seg.type === "deep-wildcard");
        this._hasAttributeCondition = this.segments.some((seg) => seg.attrName !== void 0);
        this._hasPositionSelector = this.segments.some((seg) => seg.position !== void 0);
      }
      /**
       * Parse pattern string into segments
       * @private
       * @param {string} pattern - Pattern to parse
       * @returns {Array} Array of segment objects
       */
      _parse(pattern) {
        const segments = [];
        let i = 0;
        let currentPart = "";
        while (i < pattern.length) {
          if (pattern[i] === this.separator) {
            if (i + 1 < pattern.length && pattern[i + 1] === this.separator) {
              if (currentPart.trim()) {
                segments.push(this._parseSegment(currentPart.trim()));
                currentPart = "";
              }
              segments.push({ type: "deep-wildcard" });
              i += 2;
            } else {
              if (currentPart.trim()) {
                segments.push(this._parseSegment(currentPart.trim()));
              }
              currentPart = "";
              i++;
            }
          } else {
            currentPart += pattern[i];
            i++;
          }
        }
        if (currentPart.trim()) {
          segments.push(this._parseSegment(currentPart.trim()));
        }
        return segments;
      }
      /**
       * Parse a single segment
       * @private
       * @param {string} part - Segment string (e.g., "user", "ns::user", "user[id]", "ns::user:first")
       * @returns {Object} Segment object
       */
      _parseSegment(part) {
        const segment = { type: "tag" };
        let bracketContent = null;
        let withoutBrackets = part;
        const bracketMatch = part.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
        if (bracketMatch) {
          withoutBrackets = bracketMatch[1] + bracketMatch[3];
          if (bracketMatch[2]) {
            const content = bracketMatch[2].slice(1, -1);
            if (content) {
              bracketContent = content;
            }
          }
        }
        let namespace = void 0;
        let tagAndPosition = withoutBrackets;
        if (withoutBrackets.includes("::")) {
          const nsIndex = withoutBrackets.indexOf("::");
          namespace = withoutBrackets.substring(0, nsIndex).trim();
          tagAndPosition = withoutBrackets.substring(nsIndex + 2).trim();
          if (!namespace) {
            throw new Error(`Invalid namespace in pattern: ${part}`);
          }
        }
        let tag = void 0;
        let positionMatch = null;
        if (tagAndPosition.includes(":")) {
          const colonIndex = tagAndPosition.lastIndexOf(":");
          const tagPart = tagAndPosition.substring(0, colonIndex).trim();
          const posPart = tagAndPosition.substring(colonIndex + 1).trim();
          const isPositionKeyword = ["first", "last", "odd", "even"].includes(posPart) || /^nth\(\d+\)$/.test(posPart);
          if (isPositionKeyword) {
            tag = tagPart;
            positionMatch = posPart;
          } else {
            tag = tagAndPosition;
          }
        } else {
          tag = tagAndPosition;
        }
        if (!tag) {
          throw new Error(`Invalid segment pattern: ${part}`);
        }
        segment.tag = tag;
        if (namespace) {
          segment.namespace = namespace;
        }
        if (bracketContent) {
          if (bracketContent.includes("=")) {
            const eqIndex = bracketContent.indexOf("=");
            segment.attrName = bracketContent.substring(0, eqIndex).trim();
            segment.attrValue = bracketContent.substring(eqIndex + 1).trim();
          } else {
            segment.attrName = bracketContent.trim();
          }
        }
        if (positionMatch) {
          const nthMatch = positionMatch.match(/^nth\((\d+)\)$/);
          if (nthMatch) {
            segment.position = "nth";
            segment.positionValue = parseInt(nthMatch[1], 10);
          } else {
            segment.position = positionMatch;
          }
        }
        return segment;
      }
      /**
       * Get the number of segments
       * @returns {number}
       */
      get length() {
        return this.segments.length;
      }
      /**
       * Check if expression contains deep wildcard
       * @returns {boolean}
       */
      hasDeepWildcard() {
        return this._hasDeepWildcard;
      }
      /**
       * Check if expression has attribute conditions
       * @returns {boolean}
       */
      hasAttributeCondition() {
        return this._hasAttributeCondition;
      }
      /**
       * Check if expression has position selectors
       * @returns {boolean}
       */
      hasPositionSelector() {
        return this._hasPositionSelector;
      }
      /**
       * Get string representation
       * @returns {string}
       */
      toString() {
        return this.pattern;
      }
    };
  }
});

// node_modules/path-expression-matcher/src/ExpressionSet.js
var ExpressionSet;
var init_ExpressionSet = __esm({
  "node_modules/path-expression-matcher/src/ExpressionSet.js"() {
    ExpressionSet = class {
      constructor() {
        this._byDepthAndTag = /* @__PURE__ */ new Map();
        this._wildcardByDepth = /* @__PURE__ */ new Map();
        this._deepWildcards = [];
        this._deepByTerminalTag = /* @__PURE__ */ new Map();
        this._patterns = /* @__PURE__ */ new Set();
        this._sealed = false;
      }
      /**
       * Add an Expression to the set.
       * Duplicate patterns (same pattern string) are silently ignored.
       *
       * @param {import('./Expression.js').default} expression - A pre-constructed Expression instance
       * @returns {this} for chaining
       * @throws {TypeError} if called after seal()
       *
       * @example
       * set.add(new Expression('root.users.user'));
       * set.add(new Expression('..script'));
       */
      add(expression) {
        if (this._sealed) {
          throw new TypeError(
            "ExpressionSet is sealed. Create a new ExpressionSet to add more expressions."
          );
        }
        if (this._patterns.has(expression.pattern)) return this;
        this._patterns.add(expression.pattern);
        if (expression.hasDeepWildcard()) {
          const lastSeg2 = expression.segments[expression.segments.length - 1];
          if (lastSeg2 && lastSeg2.type !== "deep-wildcard" && lastSeg2.tag !== "*") {
            const tag2 = lastSeg2.tag;
            if (!this._deepByTerminalTag.has(tag2)) this._deepByTerminalTag.set(tag2, []);
            this._deepByTerminalTag.get(tag2).push(expression);
          } else {
            this._deepWildcards.push(expression);
          }
          return this;
        }
        const depth = expression.length;
        const lastSeg = expression.segments[expression.segments.length - 1];
        const tag = lastSeg?.tag;
        if (!tag || tag === "*") {
          if (!this._wildcardByDepth.has(depth)) this._wildcardByDepth.set(depth, []);
          this._wildcardByDepth.get(depth).push(expression);
        } else {
          const key = `${depth}:${tag}`;
          if (!this._byDepthAndTag.has(key)) this._byDepthAndTag.set(key, []);
          this._byDepthAndTag.get(key).push(expression);
        }
        return this;
      }
      /**
       * Add multiple expressions at once.
       *
       * @param {import('./Expression.js').default[]} expressions - Array of Expression instances
       * @returns {this} for chaining
       *
       * @example
       * set.addAll([
       *   new Expression('root.users.user'),
       *   new Expression('root.config.setting'),
       * ]);
       */
      addAll(expressions) {
        for (const expr of expressions) this.add(expr);
        return this;
      }
      /**
       * Check whether a pattern string is already present in the set.
       *
       * @param {import('./Expression.js').default} expression
       * @returns {boolean}
       */
      has(expression) {
        return this._patterns.has(expression.pattern);
      }
      /**
       * Number of expressions in the set.
       * @type {number}
       */
      get size() {
        return this._patterns.size;
      }
      /**
       * Seal the set against further modifications.
       * Useful to prevent accidental mutations after config is built.
       * Calling add() or addAll() on a sealed set throws a TypeError.
       *
       * @returns {this}
       */
      seal() {
        this._sealed = true;
        return this;
      }
      /**
       * Whether the set has been sealed.
       * @type {boolean}
       */
      get isSealed() {
        return this._sealed;
      }
      /**
       * Test whether the matcher's current path matches any expression in the set.
       *
       * Evaluation order (cheapest → most expensive):
       *  1. Exact depth + tag bucket  — O(1) lookup, typically 0–2 expressions
       *  2. Depth-only wildcard bucket — O(1) lookup, rare
       *  3. Deep-wildcard list         — always checked, but usually small
       *
       * @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
       * @returns {boolean} true if any expression matches the current path
       *
       * @example
       * if (stopNodes.matchesAny(matcher)) {
       *   // handle stop node
       * }
       */
      matchesAny(matcher) {
        return this.findMatch(matcher) !== null;
      }
      /**
      * Find and return the first Expression that matches the matcher's current path.
      *
      * Uses the same evaluation order as matchesAny (cheapest → most expensive):
      *  1. Exact depth + tag bucket
      *  2. Depth-only wildcard bucket
      *  3. Deep-wildcard list
      *
      * @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
      * @returns {import('./Expression.js').default | null} the first matching Expression, or null
      *
      * @example
      * const expr = stopNodes.findMatch(matcher);
      * if (expr) {
      *   // access expr.config, expr.pattern, etc.
      * }
      */
      findMatch(matcher) {
        const depth = matcher.getDepth();
        const tag = matcher.getCurrentTag();
        const exactKey = `${depth}:${tag}`;
        const exactBucket = this._byDepthAndTag.get(exactKey);
        if (exactBucket) {
          for (let i = 0; i < exactBucket.length; i++) {
            if (matcher.matches(exactBucket[i])) return exactBucket[i];
          }
        }
        const wildcardBucket = this._wildcardByDepth.get(depth);
        if (wildcardBucket) {
          for (let i = 0; i < wildcardBucket.length; i++) {
            if (matcher.matches(wildcardBucket[i])) return wildcardBucket[i];
          }
        }
        const deepBucket = this._deepByTerminalTag.get(tag);
        if (deepBucket) {
          for (let i = 0; i < deepBucket.length; i++) {
            if (matcher.matches(deepBucket[i])) return deepBucket[i];
          }
        }
        for (let i = 0; i < this._deepWildcards.length; i++) {
          if (matcher.matches(this._deepWildcards[i])) return this._deepWildcards[i];
        }
        return null;
      }
    };
  }
});

// node_modules/path-expression-matcher/src/Matcher.js
var MatcherView, Matcher;
var init_Matcher = __esm({
  "node_modules/path-expression-matcher/src/Matcher.js"() {
    MatcherView = class {
      /**
       * @param {Matcher} matcher - The parent Matcher instance to read from.
       */
      constructor(matcher) {
        this._matcher = matcher;
      }
      /**
       * Get the path separator used by the parent matcher.
       * @returns {string}
       */
      get separator() {
        return this._matcher.separator;
      }
      /**
       * Get current tag name.
       * @returns {string|undefined}
       */
      getCurrentTag() {
        const path = this._matcher.path;
        return path.length > 0 ? path[path.length - 1].tag : void 0;
      }
      /**
       * Get current namespace.
       * @returns {string|undefined}
       */
      getCurrentNamespace() {
        const path = this._matcher.path;
        return path.length > 0 ? path[path.length - 1].namespace : void 0;
      }
      /**
       * Get current node's attribute value.
       * @param {string} attrName
       * @returns {*}
       */
      getAttrValue(attrName) {
        const path = this._matcher.path;
        if (path.length === 0) return void 0;
        return path[path.length - 1].values?.[attrName];
      }
      /**
       * Check if current node has an attribute.
       * @param {string} attrName
       * @returns {boolean}
       */
      hasAttr(attrName) {
        const path = this._matcher.path;
        if (path.length === 0) return false;
        const current = path[path.length - 1];
        return current.values !== void 0 && attrName in current.values;
      }
      /**
       * Get the value of a "kept" attribute from the nearest ancestor (or
       * current node) that declared it via `push(tag, attrs, ns, { keep: [...] })`.
       * @param {string} attrName
       * @returns {*}
       */
      getAnyParentAttr(attrName) {
        return this._matcher.getAnyParentAttr(attrName);
      }
      /**
       * Check whether any ancestor (or the current node) kept the given
       * attribute via `push(tag, attrs, ns, { keep: [...] })`.
       * @param {string} attrName
       * @returns {boolean}
       */
      hasAnyParentAttr(attrName) {
        return this._matcher.hasAnyParentAttr(attrName);
      }
      /**
       * Get current node's sibling position (child index in parent).
       * @returns {number}
       */
      getPosition() {
        const path = this._matcher.path;
        if (path.length === 0) return -1;
        return path[path.length - 1].position ?? 0;
      }
      /**
       * Get current node's repeat counter (occurrence count of this tag name).
       * @returns {number}
       */
      getCounter() {
        const path = this._matcher.path;
        if (path.length === 0) return -1;
        return path[path.length - 1].counter ?? 0;
      }
      /**
       * Get current node's sibling index (alias for getPosition).
       * @returns {number}
       * @deprecated Use getPosition() or getCounter() instead
       */
      getIndex() {
        return this.getPosition();
      }
      /**
       * Get current path depth.
       * @returns {number}
       */
      getDepth() {
        return this._matcher.path.length;
      }
      /**
       * Get path as string.
       * @param {string} [separator] - Optional separator (uses default if not provided)
       * @param {boolean} [includeNamespace=true]
       * @returns {string}
       */
      toString(separator, includeNamespace = true) {
        return this._matcher.toString(separator, includeNamespace);
      }
      /**
       * Get path as array of tag names.
       * @returns {string[]}
       */
      toArray() {
        return this._matcher.path.map((n) => n.tag);
      }
      /**
       * Match current path against an Expression.
       * @param {Expression} expression
       * @returns {boolean}
       */
      matches(expression) {
        return this._matcher.matches(expression);
      }
      /**
       * Match any expression in the given set against the current path.
       * @param {ExpressionSet} exprSet
       * @returns {boolean}
       */
      matchesAny(exprSet) {
        return exprSet.matchesAny(this._matcher);
      }
    };
    Matcher = class {
      /**
       * Create a new Matcher.
       * @param {Object} [options={}]
       * @param {string} [options.separator='.'] - Default path separator
       */
      constructor(options = {}) {
        this.separator = options.separator || ".";
        this.path = [];
        this.siblingStacks = [];
        this._pathStringCache = null;
        this._view = new MatcherView(this);
        this._keptAttrs = [];
      }
      /**
       * Push a new tag onto the path.
       * @param {string} tagName
       * @param {Object|null} [attrValues=null]
       * @param {string|null} [namespace=null]
       * @param {Object|null} [options=null]
       * @param {string[]} [options.keep] - Names of attributes (from attrValues)
       */
      push(tagName, attrValues = null, namespace = null, options = null) {
        this._pathStringCache = null;
        if (this.path.length > 0) {
          this.path[this.path.length - 1].values = void 0;
        }
        const currentLevel = this.path.length;
        let level = this.siblingStacks[currentLevel];
        if (!level) {
          level = { counts: /* @__PURE__ */ new Map(), total: 0 };
          this.siblingStacks[currentLevel] = level;
        }
        const siblingKey = namespace ? `${namespace}:${tagName}` : tagName;
        const counter = level.counts.get(siblingKey) || 0;
        const position = level.total;
        level.counts.set(siblingKey, counter + 1);
        level.total++;
        const node = {
          tag: tagName,
          position,
          counter
        };
        if (namespace !== null && namespace !== void 0) {
          node.namespace = namespace;
        }
        if (attrValues !== null && attrValues !== void 0) {
          node.values = attrValues;
        }
        this.path.push(node);
        const depth = this.path.length;
        const keep = options !== null ? options.keep : null;
        if (keep !== null && keep !== void 0 && keep.length > 0 && attrValues) {
          for (let i = 0; i < keep.length; i++) {
            const name = keep[i];
            if (attrValues[name] !== void 0) {
              this._keptAttrs.push({ depth, name, value: attrValues[name] });
            }
          }
        }
      }
      /**
       * Pop the last tag from the path.
       * @returns {Object|undefined} The popped node
       */
      pop() {
        if (this.path.length === 0) return void 0;
        this._pathStringCache = null;
        const node = this.path.pop();
        if (this.siblingStacks.length > this.path.length + 1) {
          this.siblingStacks.length = this.path.length + 1;
        }
        const poppedDepth = this.path.length + 1;
        while (this._keptAttrs.length > 0 && this._keptAttrs[this._keptAttrs.length - 1].depth >= poppedDepth) {
          this._keptAttrs.pop();
        }
        return node;
      }
      /**
       * Update current node's attribute values.
       * Useful when attributes are parsed after push.
       * @param {Object} attrValues
       */
      updateCurrent(attrValues) {
        if (this.path.length > 0) {
          const current = this.path[this.path.length - 1];
          if (attrValues !== null && attrValues !== void 0) {
            current.values = attrValues;
          }
        }
      }
      /**
       * Get current tag name.
       * @returns {string|undefined}
       */
      getCurrentTag() {
        return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
      }
      /**
       * Get current namespace.
       * @returns {string|undefined}
       */
      getCurrentNamespace() {
        return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
      }
      /**
       * Get current node's attribute value.
       * @param {string} attrName
       * @returns {*}
       */
      getAttrValue(attrName) {
        if (this.path.length === 0) return void 0;
        return this.path[this.path.length - 1].values?.[attrName];
      }
      /**
       * Check if current node has an attribute.
       * @param {string} attrName
       * @returns {boolean}
       */
      hasAttr(attrName) {
        if (this.path.length === 0) return false;
        const current = this.path[this.path.length - 1];
        return current.values !== void 0 && attrName in current.values;
      }
      /**
       * Get the value of a "kept" attribute from the nearest ancestor (or
       * current node) that declared it via `push(tag, attrs, ns, { keep: [...] })`.
       * Unlike getAttrValue(), this works regardless of how deep the path has
       * gone since the attribute was pushed — but only for attribute names that
       * were explicitly marked with `keep` at push time. Cost is proportional to
       * the number of currently-kept attributes (typically 0-3), not path depth.
       * @param {string} attrName
       * @returns {*} the value, or undefined if no ancestor kept this attribute
       */
      getAnyParentAttr(attrName) {
        const kept = this._keptAttrs;
        for (let i = kept.length - 1; i >= 0; i--) {
          if (kept[i].name === attrName) return kept[i].value;
        }
        return void 0;
      }
      /**
       * Check whether any ancestor (or the current node) kept the given
       * attribute via `push(tag, attrs, ns, { keep: [...] })`.
       * @param {string} attrName
       * @returns {boolean}
       */
      hasAnyParentAttr(attrName) {
        const kept = this._keptAttrs;
        for (let i = kept.length - 1; i >= 0; i--) {
          if (kept[i].name === attrName) return true;
        }
        return false;
      }
      /**
       * Get current node's sibling position (child index in parent).
       * @returns {number}
       */
      getPosition() {
        if (this.path.length === 0) return -1;
        return this.path[this.path.length - 1].position ?? 0;
      }
      /**
       * Get current node's repeat counter (occurrence count of this tag name).
       * @returns {number}
       */
      getCounter() {
        if (this.path.length === 0) return -1;
        return this.path[this.path.length - 1].counter ?? 0;
      }
      /**
       * Get current node's sibling index (alias for getPosition).
       * @returns {number}
       * @deprecated Use getPosition() or getCounter() instead
       */
      getIndex() {
        return this.getPosition();
      }
      /**
       * Get current path depth.
       * @returns {number}
       */
      getDepth() {
        return this.path.length;
      }
      /**
       * Get path as string.
       * @param {string} [separator] - Optional separator (uses default if not provided)
       * @param {boolean} [includeNamespace=true]
       * @returns {string}
       */
      toString(separator, includeNamespace = true) {
        const sep2 = separator || this.separator;
        const isDefault = sep2 === this.separator && includeNamespace === true;
        if (isDefault) {
          if (this._pathStringCache !== null) {
            return this._pathStringCache;
          }
          const result = this.path.map(
            (n) => n.namespace ? `${n.namespace}:${n.tag}` : n.tag
          ).join(sep2);
          this._pathStringCache = result;
          return result;
        }
        return this.path.map(
          (n) => includeNamespace && n.namespace ? `${n.namespace}:${n.tag}` : n.tag
        ).join(sep2);
      }
      /**
       * Get path as array of tag names.
       * @returns {string[]}
       */
      toArray() {
        return this.path.map((n) => n.tag);
      }
      /**
       * Reset the path to empty.
       */
      reset() {
        this._pathStringCache = null;
        this.path = [];
        this.siblingStacks = [];
        this._keptAttrs = [];
      }
      /**
       * Match current path against an Expression.
       * @param {Expression} expression
       * @returns {boolean}
       */
      matches(expression) {
        const segments = expression.segments;
        if (segments.length === 0) {
          return false;
        }
        if (expression.hasDeepWildcard()) {
          return this._matchWithDeepWildcard(segments);
        }
        return this._matchSimple(segments);
      }
      /**
       * @private
       */
      _matchSimple(segments) {
        if (this.path.length !== segments.length) {
          return false;
        }
        for (let i = 0; i < segments.length; i++) {
          if (!this._matchSegment(segments[i], this.path[i], i === this.path.length - 1)) {
            return false;
          }
        }
        return true;
      }
      /**
       * @private
       */
      _matchWithDeepWildcard(segments) {
        let pathIdx = this.path.length - 1;
        let segIdx = segments.length - 1;
        while (segIdx >= 0 && pathIdx >= 0) {
          const segment = segments[segIdx];
          if (segment.type === "deep-wildcard") {
            segIdx--;
            if (segIdx < 0) {
              return true;
            }
            const nextSeg = segments[segIdx];
            let found = false;
            for (let i = pathIdx; i >= 0; i--) {
              if (this._matchSegment(nextSeg, this.path[i], i === this.path.length - 1)) {
                pathIdx = i - 1;
                segIdx--;
                found = true;
                break;
              }
            }
            if (!found) {
              return false;
            }
          } else {
            if (!this._matchSegment(segment, this.path[pathIdx], pathIdx === this.path.length - 1)) {
              return false;
            }
            pathIdx--;
            segIdx--;
          }
        }
        return segIdx < 0;
      }
      /**
       * @private
       */
      _matchSegment(segment, node, isCurrentNode) {
        if (segment.tag !== "*" && segment.tag !== node.tag) {
          return false;
        }
        if (segment.namespace !== void 0) {
          if (segment.namespace !== "*" && segment.namespace !== node.namespace) {
            return false;
          }
        }
        if (segment.attrName !== void 0) {
          if (!isCurrentNode) {
            return false;
          }
          if (!node.values || !(segment.attrName in node.values)) {
            return false;
          }
          if (segment.attrValue !== void 0) {
            if (String(node.values[segment.attrName]) !== String(segment.attrValue)) {
              return false;
            }
          }
        }
        if (segment.position !== void 0) {
          if (!isCurrentNode) {
            return false;
          }
          const counter = node.counter ?? 0;
          if (segment.position === "first" && counter !== 0) {
            return false;
          } else if (segment.position === "odd" && counter % 2 !== 1) {
            return false;
          } else if (segment.position === "even" && counter % 2 !== 0) {
            return false;
          } else if (segment.position === "nth" && counter !== segment.positionValue) {
            return false;
          }
        }
        return true;
      }
      /**
       * Match any expression in the given set against the current path.
       * @param {ExpressionSet} exprSet
       * @returns {boolean}
       */
      matchesAny(exprSet) {
        return exprSet.matchesAny(this);
      }
      /**
       * Create a snapshot of current state.
       * @returns {Object}
       */
      snapshot() {
        return {
          path: this.path.map((node) => ({ ...node })),
          siblingStacks: this.siblingStacks.map((level) => level ? { counts: new Map(level.counts), total: level.total } : level),
          keptAttrs: this._keptAttrs.map((entry) => ({ ...entry }))
        };
      }
      /**
       * Restore state from snapshot.
       * @param {Object} snapshot
       */
      restore(snapshot) {
        this._pathStringCache = null;
        this.path = snapshot.path.map((node) => ({ ...node }));
        this.siblingStacks = snapshot.siblingStacks.map((level) => level ? { counts: new Map(level.counts), total: level.total } : level);
        this._keptAttrs = (snapshot.keptAttrs || []).map((entry) => ({ ...entry }));
      }
      /**
       * Return the read-only {@link MatcherView} for this matcher.
       *
       * The same instance is returned on every call — no allocation occurs.
       * It always reflects the current parser state and is safe to pass to
       * user callbacks without risk of accidental mutation.
       *
       * @returns {MatcherView}
       *
       * @example
       * const view = matcher.readOnly();
       * // pass view to callbacks — it stays in sync automatically
       * view.matches(expr);       // ✓
       * view.getCurrentTag();     // ✓
       * // view.push(...)         // ✗ method does not exist — caught by TypeScript
       */
      readOnly() {
        return this._view;
      }
    };
  }
});

// node_modules/path-expression-matcher/src/index.js
var init_src3 = __esm({
  "node_modules/path-expression-matcher/src/index.js"() {
    init_Expression();
    init_Matcher();
    init_ExpressionSet();
  }
});

// node_modules/is-unsafe/src/contexts/html.js
var HTML_PATTERNS, html_default;
var init_html = __esm({
  "node_modules/is-unsafe/src/contexts/html.js"() {
    HTML_PATTERNS = [
      {
        id: "html-script-open",
        description: "<script opening tag",
        pattern: /<script[\s>/]/i
      },
      {
        id: "html-script-close",
        description: "</script closing tag",
        pattern: /<\/script[\s>]/i
      },
      {
        id: "html-javascript-protocol",
        description: "javascript: URI scheme (with optional whitespace/encoding)",
        // Handles j&#x61;vascript:, j\u0061vascript:, and whitespace variants
        pattern: /j[\t\n\r ]*a[\t\n\r ]*v[\t\n\r ]*a[\t\n\r ]*s[\t\n\r ]*c[\t\n\r ]*r[\t\n\r ]*i[\t\n\r ]*p[\t\n\r ]*t[\t\n\r ]*:/i
      },
      {
        id: "html-vbscript-protocol",
        description: "vbscript: URI scheme",
        pattern: /vbscript[\t\n\r ]*:/i
      },
      {
        id: "html-data-html",
        description: "data:text/html URI \u2014 can execute scripts in browsers",
        pattern: /data[\t\n\r ]*:[\t\n\r ]*text\/html/i
      },
      {
        id: "html-data-xhtml",
        description: "data:application/xhtml+xml URI",
        pattern: /data[\t\n\r ]*:[\t\n\r ]*application\/xhtml/i
      },
      {
        id: "html-data-svg",
        description: "data:image/svg+xml URI \u2014 can execute scripts",
        pattern: /data[\t\n\r ]*:[\t\n\r ]*image\/svg\+xml/i
      },
      {
        id: "html-inline-event-handler",
        description: "Inline event handler attributes: onclick=, onerror=, onload=, etc.",
        // \bon ensures we match a word boundary so "phonetic=" is not caught
        pattern: /\bon\w{1,30}\s*=/i
      },
      {
        id: "html-entity-obfuscated-script",
        description: "HTML-entity-encoded <script (e.g. &#x3C;script or &lt;script)",
        // Entities include optional trailing semicolon: &#x3C; or &#x3C (both valid in HTML5)
        pattern: /(?:&#x0*3[Cc];?|&#0*60;?|&lt;)\s*script/i
      },
      {
        id: "html-entity-obfuscated-javascript",
        description: 'HTML-entity-encoded javascript: (partial \u2014 catches common &#106; or &#x6a; for "j")',
        pattern: /(?:&#x0*6[Aa];?|&#0*106;?)\s*(?:&#x0*61;?|a)[\s\S]{0,80}script\s*:/i
      },
      {
        id: "html-style-expression",
        description: "CSS expression() \u2014 IE-era code execution in style attributes",
        pattern: /style[\s\S]{0,20}expression\s*\(/i
      },
      {
        id: "html-object-embed",
        description: "<object or <embed tags that can load active content",
        pattern: /<(?:object|embed)[\s>/]/i
      },
      {
        id: "html-base-tag",
        description: "<base href= \u2014 can hijack all relative URLs on a page",
        pattern: /<base[\s>]/i
      },
      {
        id: "html-meta-refresh",
        description: '<meta http-equiv="refresh" \u2014 can redirect users',
        pattern: /<meta[\s\S]{0,40}http-equiv[\s\S]{0,20}refresh/i
      },
      {
        id: "html-srcdoc",
        description: "srcdoc= attribute on iframes \u2014 embeds HTML that can run scripts",
        pattern: /srcdoc\s*=/i
      },
      {
        id: "html-iframe",
        description: "<iframe tag",
        pattern: /<iframe[\s>/]/i
      },
      {
        id: "html-form",
        description: "<form tag \u2014 can be used for phishing / credential harvesting injection",
        pattern: /<form[\s>/]/i
      }
    ];
    html_default = HTML_PATTERNS;
  }
});

// node_modules/is-unsafe/src/contexts/xml.js
var XML_PATTERNS, xml_default;
var init_xml = __esm({
  "node_modules/is-unsafe/src/contexts/xml.js"() {
    XML_PATTERNS = [
      {
        id: "xml-cdata-injection",
        description: "CDATA section injection: <![CDATA[ breaks out of text node context",
        pattern: /<!\[CDATA\[/i
      },
      {
        id: "xml-cdata-close",
        description: "CDATA close sequence: ]]> can terminate an enclosing CDATA section",
        pattern: /\]\]>/
      },
      {
        id: "xml-processing-instruction",
        description: "XML processing instruction: <?xml-stylesheet or <?php etc.",
        pattern: /<\?(?:xml[\- ]|php|asp)/i
      },
      {
        id: "xml-doctype-injection",
        description: "DOCTYPE declaration embedded in content \u2014 can define entities",
        // Match <!DOCTYPE followed by end-of-string, whitespace, or [ (internal subset)
        pattern: /<!DOCTYPE(?:[\s[]|$)/i
      },
      {
        id: "xml-entity-system",
        description: "SYSTEM keyword \u2014 used in external entity declarations (XXE)",
        pattern: /\bSYSTEM\s+["']/i
      },
      {
        id: "xml-entity-public",
        description: "PUBLIC keyword \u2014 used in external entity declarations (XXE)",
        pattern: /\bPUBLIC\s+["']/i
      },
      {
        id: "xml-entity-declaration",
        description: "<!ENTITY declaration \u2014 defines entities, potential XXE or entity expansion",
        pattern: /<!ENTITY[\s%]/i
      },
      {
        id: "xml-billion-laughs",
        description: "Entity reference chaining / billion laughs: repeated &eX; style references",
        // Heuristic: 3+ consecutive entity refs suggests expansion attack
        pattern: /(?:&\w{1,20};){3,}/
      },
      {
        id: "xml-namespace-confusion",
        description: "xmlns: attribute injection \u2014 can redefine namespaces to confuse parsers",
        // pattern: /\bxmlns\s*(?::\w{1,40})?\s*=/i,
        pattern: /\bxmlns(?::\w{1,40})?\s*=/i
      },
      {
        id: "xml-comment-injection",
        description: "<!-- comment injection \u2014 can hide content from some parsers",
        pattern: /<!--/
      },
      {
        id: "xml-comment-close",
        description: "--> closes an enclosing XML comment",
        pattern: /-->/
      },
      {
        id: "xml-pi-close",
        description: "?> closes an enclosing processing instruction",
        pattern: /\?>/
      }
    ];
    xml_default = XML_PATTERNS;
  }
});

// node_modules/is-unsafe/src/contexts/svg.js
var SVG_PATTERNS, svg_default;
var init_svg = __esm({
  "node_modules/is-unsafe/src/contexts/svg.js"() {
    SVG_PATTERNS = [
      {
        id: "svg-script-element",
        description: "<script element inside SVG executes JavaScript",
        pattern: /<script[\s>/]/i
      },
      {
        id: "svg-xlink-href-javascript",
        description: "xlink:href with javascript: \u2014 classic SVG XSS via <a> or <use>",
        pattern: /xlink\s*:\s*href\s*=\s*["']?\s*javascript\s*:/i
      },
      {
        id: "svg-href-javascript",
        description: "href= with javascript: in SVG context (<a>, <animate>, etc.)",
        pattern: /href\s*=\s*["']?\s*javascript\s*:/i
      },
      {
        id: "svg-foreignobject",
        description: "<foreignObject embeds HTML inside SVG \u2014 can execute scripts",
        pattern: /<foreignObject[\s>/]/i
      },
      {
        id: "svg-use-external",
        description: "<use xlink:href or href pointing to external resource (non-fragment URL)",
        // Match <use with href= where the value starts with a non-# character (external URL)
        // [\"'][^#] catches quoted values not starting with #; [^\"'#\s>] catches unquoted
        pattern: /<use[\s\S]{0,60}(?:xlink\s*:\s*)?href\s*=\s*(?:["'][^#]|[^"'#\s>])/i
      },
      {
        id: "svg-animate-href",
        description: '<animate attributeName="href" \u2014 can dynamically change href to javascript:',
        pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*href["']/i
      },
      {
        id: "svg-animate-xlinkhref",
        description: '<animate attributeName="xlink:href"',
        pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*xlink\s*:\s*href["']/i
      },
      {
        id: "svg-set-javascript",
        description: '<set to="javascript:..." \u2014 sets an attribute to a javascript: URI',
        pattern: /<set[\s\S]{0,80}to\s*=\s*["']?\s*javascript\s*:/i
      },
      {
        id: "svg-event-handler",
        description: "SVG-specific event handler attributes: onload=, onerror=, onactivate=, etc.",
        pattern: /\bon(?:load|error|activate|begin|end|repeat|focus|blur|click|mouse\w{1,20}|key\w{1,20})\s*=/i
      },
      {
        id: "svg-handler-generic",
        description: "Generic on* handler catch-all for SVG attributes",
        pattern: /\bon\w{1,30}\s*=/i
      },
      {
        id: "svg-filter-feimage",
        description: "<feImage href= \u2014 filter primitive that can load external resources",
        pattern: /<feImage[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=/i
      },
      {
        id: "svg-image-external",
        description: "<image xlink:href with http/https or javascript protocol",
        pattern: /<image[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=\s*["']?\s*(?:https?|javascript)\s*:/i
      },
      {
        id: "svg-style-javascript",
        description: "style= attribute containing javascript: (e.g. background:url(javascript:...))",
        pattern: /style\s*=[\s\S]{0,60}javascript\s*:/i
      }
    ];
    svg_default = SVG_PATTERNS;
  }
});

// node_modules/is-unsafe/src/contexts/sql.js
var SQL_PATTERNS, sql_default;
var init_sql = __esm({
  "node_modules/is-unsafe/src/contexts/sql.js"() {
    SQL_PATTERNS = [
      {
        id: "sql-block-comment-open",
        description: "SQL block comment open: /* ... */ \u2014 unusual in legitimate user text",
        pattern: /\/\*/
      },
      {
        id: "sql-union-select",
        description: "UNION SELECT \u2014 most common SQL injection aggregation attack",
        pattern: /\bUNION\s{1,20}(?:ALL\s{1,20})?SELECT\b/i
      },
      {
        id: "sql-drop-table",
        description: "DROP TABLE \u2014 destructive DDL injection",
        pattern: /\bDROP\s{1,20}TABLE\b/i
      },
      {
        id: "sql-drop-database",
        description: "DROP DATABASE \u2014 destructive DDL injection",
        pattern: /\bDROP\s{1,20}DATABASE\b/i
      },
      {
        id: "sql-insert-into",
        description: "INSERT INTO \u2014 data injection",
        pattern: /\bINSERT\s{1,20}INTO\b/i
      },
      {
        id: "sql-delete-from",
        description: "DELETE FROM \u2014 data deletion injection",
        pattern: /\bDELETE\s{1,20}FROM\b/i
      },
      {
        id: "sql-update-set",
        description: "UPDATE ... SET \u2014 data modification injection",
        // Allows arbitrary content between UPDATE and SET (table name, alias, etc.)
        pattern: /\bUPDATE\b[\s\S]{1,60}\bSET\b/i
      },
      {
        id: "sql-exec-xp",
        description: "EXEC xp_ \u2014 MSSQL extended stored procedure execution",
        pattern: /\bEXEC(?:UTE)?\s{1,20}xp_/i
      },
      {
        id: "sql-tautology-string",
        description: `Classic string tautology: ' OR '1'='1 or " OR "1"="1"`,
        // Last quote is optional — injection may truncate it: ' OR '1'='1--
        pattern: /'\s{0,10}OR\s{0,10}'[^']{0,20}'\s*=\s*'[^']{0,20}/i
      },
      {
        id: "sql-tautology-numeric",
        description: "Numeric tautology: OR 1=1",
        pattern: /\bOR\s{1,10}1\s*=\s*1\b/i
      },
      {
        id: "sql-always-true-zero",
        description: "Numeric tautology: OR 0=0",
        pattern: /\bOR\s{1,10}0\s*=\s*0\b/i
      },
      {
        id: "sql-sleep-benchmark",
        description: "Time-based blind injection: SLEEP() or BENCHMARK()",
        pattern: /\b(?:SLEEP|BENCHMARK)\s*\(/i
      },
      {
        id: "sql-waitfor-delay",
        description: "MSSQL time-based blind injection: WAITFOR DELAY",
        pattern: /\bWAITFOR\s{1,20}DELAY\b/i
      },
      {
        id: "sql-char-function",
        description: "CHAR() function \u2014 used to obfuscate injected strings",
        pattern: /\bCHAR\s*\(\s*\d{1,3}/i
      },
      {
        id: "sql-information-schema",
        description: "INFORMATION_SCHEMA \u2014 reconnaissance query for table/column enumeration",
        pattern: /\bINFORMATION_SCHEMA\b/i
      }
    ];
    sql_default = SQL_PATTERNS;
  }
});

// node_modules/is-unsafe/src/contexts/shell.js
var SHELL_PATTERNS, shell_default;
var init_shell = __esm({
  "node_modules/is-unsafe/src/contexts/shell.js"() {
    SHELL_PATTERNS = [
      {
        id: "shell-path-traversal-unix",
        description: "Unix path traversal: ../  \u2014 climbing the directory tree",
        pattern: /\.\.\//
      },
      {
        id: "shell-path-traversal-windows",
        description: "Windows path traversal: ..\\ \u2014 climbing the directory tree",
        pattern: /\.\.\\/
      },
      {
        id: "shell-path-traversal-encoded",
        description: "URL-encoded path traversal: %2e%2e or %2f variants",
        pattern: /%2e%2e|%2f\.\.|\.\.%2f/i
      },
      {
        id: "shell-null-byte",
        description: "Null byte injection: \\x00 or %00 \u2014 truncates strings in C-backed functions",
        pattern: /\x00|%00/
      },
      {
        id: "shell-semicolon",
        description: "Semicolon command separator: cmd1; cmd2",
        pattern: /;/
      },
      {
        id: "shell-pipe",
        description: "Pipe operator: cmd1 | cmd2",
        pattern: /\|/
      },
      {
        id: "shell-and-operator",
        description: "AND operator: cmd1 && cmd2",
        pattern: /&&/
      },
      {
        id: "shell-or-operator",
        description: "OR operator: cmd1 || cmd2",
        pattern: /\|\|/
      },
      {
        id: "shell-backtick",
        description: "Backtick command substitution: `cmd`",
        pattern: /`/
      },
      {
        id: "shell-dollar-paren",
        description: "Dollar-paren command substitution: $(cmd)",
        pattern: /\$\(/
      },
      {
        id: "shell-dollar-brace",
        description: "Dollar-brace variable expansion: ${var} \u2014 can be abused for injection",
        pattern: /\$\{/
      },
      {
        id: "shell-redirect-out",
        description: "Output redirection: cmd > file or cmd >> file",
        pattern: />{1,2}/
      },
      {
        id: "shell-redirect-in",
        description: "Input redirection: cmd < file",
        pattern: /</
      },
      {
        id: "shell-newline-injection",
        description: "Newline injection: \\n or \\r \u2014 can inject new shell commands",
        pattern: /[\n\r]/
      },
      {
        id: "shell-glob-star",
        description: "Glob expansion: * or ? \u2014 can expand to unintended files",
        // Only flag when combined with path separators to reduce false positives
        pattern: /[/\\][*?]/
      },
      {
        id: "shell-absolute-root",
        description: "Absolute root path injection: string starting with / or \\ (Windows UNC)",
        pattern: /^(?:\/|\\\\)/
      },
      {
        id: "shell-windows-drive",
        description: "Windows drive letter path injection: C:\\ or D:/",
        pattern: /^[a-zA-Z]:[/\\]/
      },
      {
        id: "shell-curl-wget",
        description: "curl/wget with URL or flags \u2014 can exfiltrate data or download payloads",
        // Require a URL scheme (http/https/ftp) or a flag (-) to reduce false positives
        // "curl is a tool" won't match; "curl http://..." or "curl -s ..." will
        pattern: /\b(?:curl|wget)\s+(?:https?:\/\/|ftp:\/\/|-)/i
      }
    ];
    shell_default = SHELL_PATTERNS;
  }
});

// node_modules/is-unsafe/src/contexts/redos.js
var REDOS_PATTERNS, redos_default;
var init_redos = __esm({
  "node_modules/is-unsafe/src/contexts/redos.js"() {
    REDOS_PATTERNS = [
      {
        id: "redos-nested-quantifier-plus",
        description: "Nested + quantifier inside a group with outer quantifier: (a+)+, (.+b)*, etc.",
        // Matches any group containing a + quantifier, with an outer * or + — catches (a+)+, (.+b)*, etc.
        pattern: /\([^)]*\+[^)]*\)[+*]/
      },
      {
        id: "redos-nested-quantifier-star",
        description: "Nested * quantifier: (a*)* or (a*)+ \u2014 catastrophic backtracking",
        pattern: /\([^)]*\*[^)]*\)[*+]/
      },
      {
        id: "redos-nested-groups",
        description: "Doubly nested quantified groups: ((a+)+) \u2014 guaranteed catastrophic",
        pattern: /\(\([^)]{0,40}\)[+*]\)[+*]/
      },
      {
        id: "redos-alternation-overlap",
        description: "Overlapping alternation under quantifier: (a|a)+ \u2014 ambiguous NFA paths",
        // Detect repeated identical alternatives under a quantifier
        pattern: /\(([^|()]{1,20})\|(?:\1)(?:\|[^|()]{1,20}){0,5}\)[+*?]{1,2}/
      },
      {
        id: "redos-star-plus-concat",
        description: "(x*x)+ pattern \u2014 triggers super-linear backtracking",
        pattern: /\([^)]{0,10}\*[^)]{0,10}\)[+*]/
      },
      {
        id: "redos-dot-star-greedy",
        description: "(.*){n,} or (.+){n,} \u2014 repeated greedy dot quantifiers",
        pattern: /\(\.[*+]\)\{?\d/
      },
      {
        id: "redos-large-repetition",
        description: "Very large fixed or range repetition count {1000,} or {1000,n} \u2014 denial of service via backtracking",
        // Matches { followed by 4+ digits (≥1000), then optional ,digits }
        pattern: /\{\d{4,}(?:,\d*)?\}/
      },
      {
        id: "redos-catastrophic-alternation",
        description: "Long alternation with many similar branches \u2014 polynomial backtracking risk",
        // Heuristic: 10+ pipe-separated alternatives in a single group
        pattern: /\([^)]{0,200}(?:\|[^|)]{0,50}){9,}\)/
      }
    ];
    redos_default = REDOS_PATTERNS;
  }
});

// node_modules/is-unsafe/src/contexts/nosql.js
var sep, NOSQL_PATTERNS, nosql_default;
var init_nosql = __esm({
  "node_modules/is-unsafe/src/contexts/nosql.js"() {
    sep = `["'\\s]*:`;
    NOSQL_PATTERNS = [
      // ─── MongoDB $ operator injection ────────────────────────────────────────
      {
        id: "nosql-where-operator",
        description: "$where \u2014 executes arbitrary JavaScript server-side in MongoDB",
        pattern: new RegExp(`\\$where${sep}`, "i")
      },
      {
        id: "nosql-ne-operator",
        description: '$ne \u2014 "not equal" operator used to bypass equality checks',
        pattern: new RegExp(`\\$ne${sep}`, "i")
      },
      {
        id: "nosql-gt-operator",
        description: '$gt \u2014 "greater than" used to bypass password/value checks',
        pattern: new RegExp(`\\$gte?${sep}`, "i")
      },
      {
        id: "nosql-lt-operator",
        description: '$lt / $lte \u2014 "less than" bypass variants',
        pattern: new RegExp(`\\$lte?${sep}`, "i")
      },
      {
        id: "nosql-regex-operator",
        description: "$regex \u2014 can be used to extract data character by character (blind injection)",
        pattern: new RegExp(`\\$regex${sep}`, "i")
      },
      {
        id: "nosql-or-operator",
        description: "$or \u2014 logical OR; used to create always-true conditions",
        pattern: new RegExp(`\\$or${sep}\\s*\\[`, "i")
      },
      {
        id: "nosql-and-operator",
        description: "$and \u2014 logical AND operator injection",
        pattern: new RegExp(`\\$and${sep}\\s*\\[`, "i")
      },
      {
        id: "nosql-nor-operator",
        description: "$nor \u2014 logical NOR operator injection",
        pattern: new RegExp(`\\$nor${sep}\\s*\\[`, "i")
      },
      {
        id: "nosql-exists-operator",
        description: "$exists \u2014 can enumerate fields to determine schema",
        pattern: new RegExp(`\\$exists${sep}`, "i")
      },
      {
        id: "nosql-in-operator",
        description: "$in \u2014 matches any value in a list; can enumerate values",
        pattern: new RegExp(`\\$in${sep}\\s*\\[`, "i")
      },
      {
        id: "nosql-expr-operator",
        description: "$expr \u2014 allows aggregation expressions in queries (MongoDB 3.6+)",
        pattern: new RegExp(`\\$expr${sep}`, "i")
      },
      {
        id: "nosql-function-operator",
        description: "$function \u2014 executes arbitrary JavaScript in MongoDB 4.4+",
        pattern: new RegExp(`\\$function${sep}`, "i")
      },
      {
        id: "nosql-accumulator-operator",
        description: "$accumulator \u2014 custom aggregation with arbitrary JS execution",
        pattern: new RegExp(`\\$accumulator${sep}`, "i")
      },
      // ─── Prototype pollution ─────────────────────────────────────────────────
      {
        id: "nosql-proto-pollution",
        description: "__proto__ \u2014 prototype pollution via object key injection",
        pattern: /__proto__/
      },
      {
        id: "nosql-constructor-prototype",
        description: "constructor.prototype \u2014 alternative prototype pollution vector (dot notation or JSON key)",
        // Matches dot-notation (obj.constructor.prototype) and JSON key adjacency
        // ("constructor": {"prototype": ...})
        pattern: /constructor[\s"':.,{\[]*prototype/i
      },
      {
        id: "nosql-proto-bracket",
        description: '["__proto__"] \u2014 bracket-notation prototype pollution',
        pattern: /\[["']__proto__["']\]/
      }
    ];
    nosql_default = NOSQL_PATTERNS;
  }
});

// node_modules/is-unsafe/src/contexts/log.js
var LOG_PATTERNS, log_default;
var init_log = __esm({
  "node_modules/is-unsafe/src/contexts/log.js"() {
    LOG_PATTERNS = [
      // ─── CRLF / newline injection ─────────────────────────────────────────────
      {
        id: "log-crlf-injection",
        description: "CRLF injection: literal \\r or \\n embeds fake log lines",
        pattern: /[\r\n]/
      },
      {
        id: "log-url-encoded-crlf",
        description: "URL-encoded CRLF: %0d, %0a, %0D, %0A \u2014 decoded by some log parsers",
        pattern: /%0[dDaA]/
      },
      {
        id: "log-unicode-newline",
        description: "Unicode newline variants: U+2028 (line separator), U+2029 (paragraph separator)",
        pattern: /[\u2028\u2029]/
      },
      // ─── Log4Shell / JNDI injection (CVE-2021-44228) ─────────────────────────
      {
        id: "log-log4shell-jndi",
        description: "Log4Shell: ${jndi:...} triggers remote code execution in Apache Log4j",
        pattern: /\$\{jndi\s*:/i
      },
      {
        id: "log-log4shell-obfuscated",
        description: "Obfuscated Log4Shell: ${::-j}... lookup-bypass prefix used to evade WAF detection",
        // ${::- is the Log4j lookup-bypass escape sequence; presence alone is suspicious
        pattern: /\$\{::-/
      },
      {
        id: "log-log4j-lookup",
        description: "Log4j lookup syntax: ${env:...}, ${sys:...}, ${ctx:...} \u2014 data exfiltration",
        pattern: /\$\{(?:env|sys|ctx|main|map|sd|web|docker|k8s|spring)\s*:/i
      },
      // ─── Server-Side Template Injection (SSTI) in log messages ───────────────
      {
        id: "log-ssti-double-brace",
        description: "SSTI double-brace: {{expression}} \u2014 Jinja2, Twig, Handlebars, etc.",
        pattern: /\{\{[\s\S]{0,80}\}\}/
      },
      {
        id: "log-ssti-hash-brace",
        description: "SSTI hash-brace: #{expression} \u2014 Thymeleaf, Velocity, Ruby ERB",
        pattern: /#\{[\s\S]{0,80}\}/
      },
      {
        id: "log-ssti-dollar-brace",
        description: "SSTI/EL injection: ${expression with operators or method calls} \u2014 JSP EL, Freemarker, SpEL",
        // Require that the ${...} content looks like an expression, not a plain variable name.
        // Flags if the content contains: . ( * + operators, or known SSTI keywords.
        // This avoids flagging ${PATH}, ${HOME} etc. (plain shell variables).
        pattern: /\$\{[^}]*(?:\.|\(|\*|\+|\bclass\b|\bruntime\b|\bprocess\b|\bexec\b)[^}]{0,80}\}/i
      },
      {
        id: "log-ssti-percent-tag",
        description: "SSTI ERB/ASP tag: <%= expression %> \u2014 Ruby ERB, ASP",
        pattern: /<%=[\s\S]{0,80}%>/
      },
      // ─── Null byte ────────────────────────────────────────────────────────────
      {
        id: "log-null-byte",
        description: "Null byte: \\x00 or %00 \u2014 can truncate log entries in C-backed loggers",
        pattern: /\x00|%00/
      },
      // ─── ANSI escape injection ────────────────────────────────────────────────
      {
        id: "log-ansi-escape",
        description: "ANSI escape sequence: ESC[ \u2014 can manipulate terminal output when logs are tailed",
        pattern: /\x1b\[/
      }
    ];
    log_default = LOG_PATTERNS;
  }
});

// node_modules/is-unsafe/src/contexts/sql-strict.js
var SQL_STRICT_EXTRA, SQL_STRICT_PATTERNS, sql_strict_default;
var init_sql_strict = __esm({
  "node_modules/is-unsafe/src/contexts/sql-strict.js"() {
    init_sql();
    SQL_STRICT_EXTRA = [
      {
        id: "sql-line-comment",
        description: "SQL line comment: -- followed by whitespace or end of string",
        pattern: /--(?:\s|$)/
      },
      {
        id: "sql-stacked-query",
        description: "Stacked queries: semicolon immediately followed by a SQL keyword",
        pattern: /;\s{0,10}(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b/i
      },
      {
        id: "sql-hex-encoding",
        description: "Hex-encoded string injection: 0x41414141 style (MySQL)",
        pattern: /\b0x[0-9a-f]{4,}/i
      }
    ];
    SQL_STRICT_PATTERNS = [...sql_default, ...SQL_STRICT_EXTRA];
    sql_strict_default = SQL_STRICT_PATTERNS;
  }
});

// node_modules/is-unsafe/src/index.js
function assertString(value) {
  if (typeof value !== "string") {
    throw new TypeError(
      `is-unsafe: first argument must be a string, got ${typeof value}`
    );
  }
}
function assertContext(context) {
  if (context instanceof RegExp) return;
  if (Array.isArray(context)) {
    if (context.length === 0) {
      throw new TypeError("is-unsafe: context must not be an empty array");
    }
    if (Array.isArray(context[0])) {
      for (const list of context) {
        if (!Array.isArray(list) || list.length === 0) {
          throw new TypeError(
            "is-unsafe: each context in the array must be a non-empty pattern array (PatternList)"
          );
        }
      }
    }
    return;
  }
  throw new TypeError(
    `is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof context}`
  );
}
function normalise(context) {
  if (context instanceof RegExp) return { lists: null, regex: context };
  if (Array.isArray(context[0])) return { lists: context, regex: null };
  return { lists: [context], regex: null };
}
function matchList(value, list) {
  const label = list.label ?? "CUSTOM";
  for (const rule of list) {
    if (rule.pattern.test(value)) {
      return { context: label, id: rule.id, description: rule.description, pattern: rule.pattern };
    }
  }
  return null;
}
function isUnsafe(value, context) {
  assertString(value);
  assertContext(context);
  const { lists, regex } = normalise(context);
  if (regex) return regex.test(value);
  for (const list of lists) {
    if (matchList(value, list) !== null) return true;
  }
  return false;
}
var VALID_CONTEXTS;
var init_src4 = __esm({
  "node_modules/is-unsafe/src/index.js"() {
    init_html();
    init_xml();
    init_sql_strict();
    init_html();
    init_xml();
    init_svg();
    init_sql();
    init_shell();
    init_redos();
    init_nosql();
    init_log();
    html_default.label = "HTML";
    xml_default.label = "XML";
    svg_default.label = "SVG";
    sql_default.label = "SQL";
    sql_strict_default.label = "SQL-STRICT";
    shell_default.label = "SHELL";
    redos_default.label = "REDOS";
    nosql_default.label = "NOSQL";
    log_default.label = "LOG";
    VALID_CONTEXTS = Object.freeze({
      HTML: html_default,
      XML: xml_default,
      SVG: svg_default,
      SQL: sql_default,
      "SQL-STRICT": sql_strict_default,
      SHELL: shell_default,
      REDOS: redos_default,
      NOSQL: nosql_default,
      LOG: log_default
    });
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
function extractRawAttributes(prefixedAttrs, options) {
  if (!prefixedAttrs) return {};
  const attrs = options.attributesGroupName ? prefixedAttrs[options.attributesGroupName] : prefixedAttrs;
  if (!attrs) return {};
  const rawAttrs = {};
  for (const key in attrs) {
    if (key.startsWith(options.attributeNamePrefix)) {
      const rawName = key.substring(options.attributeNamePrefix.length);
      rawAttrs[rawName] = attrs[key];
    } else {
      rawAttrs[key] = attrs[key];
    }
  }
  return rawAttrs;
}
function extractNamespace(rawTagName) {
  if (!rawTagName || typeof rawTagName !== "string") return void 0;
  const colonIndex = rawTagName.indexOf(":");
  if (colonIndex !== -1 && colonIndex > 0) {
    const ns = rawTagName.substring(0, colonIndex);
    if (ns !== "xmlns") {
      return ns;
    }
  }
  return void 0;
}
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
  const options = this.options;
  if (val !== void 0) {
    if (options.trimValues && !dontTrim) {
      val = val.trim();
    }
    if (val.length > 0) {
      if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
      const jPathOrMatcher = options.jPath ? jPath.toString() : jPath;
      const newval = options.tagValueProcessor(tagName, val, jPathOrMatcher, hasAttributes, isLeafNode);
      if (newval === null || newval === void 0) {
        return val;
      } else if (typeof newval !== typeof val || newval !== val) {
        return newval;
      } else if (options.trimValues) {
        return parseValue(val, options.parseTagValue, options.numberParseOptions);
      } else {
        const trimmedVal = val.trim();
        if (trimmedVal === val) {
          return parseValue(val, options.parseTagValue, options.numberParseOptions);
        } else {
          return val;
        }
      }
    }
  }
}
function resolveNameSpace(tagname) {
  if (this.options.removeNSPrefix) {
    const tags = tagname.split(":");
    const prefix = tagname.charAt(0) === "/" ? "/" : "";
    if (tags[0] === "xmlns") {
      return "";
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}
function buildAttributesMap(attrStr, jPath, tagName, force = false) {
  const options = this.options;
  if (force === true || options.ignoreAttributes !== true && typeof attrStr === "string") {
    const matches = getAllMatches(attrStr, attrsRegx);
    const len = matches.length;
    const attrs = {};
    const processedVals = new Array(len);
    let hasRawAttrs = false;
    const rawAttrsForMatcher = {};
    for (let i = 0; i < len; i++) {
      const attrName = this.resolveNameSpace(matches[i][1]);
      const oldVal = matches[i][4];
      if (attrName.length && oldVal !== void 0) {
        let val = oldVal;
        if (options.trimValues) val = val.trim();
        val = this.replaceEntitiesValue(val, tagName, this.readonlyMatcher);
        processedVals[i] = val;
        rawAttrsForMatcher[attrName] = val;
        hasRawAttrs = true;
      }
    }
    if (hasRawAttrs && typeof jPath === "object" && jPath.updateCurrent) {
      jPath.updateCurrent(rawAttrsForMatcher);
    }
    const jPathStr = options.jPath ? jPath.toString() : this.readonlyMatcher;
    let hasAttrs = false;
    for (let i = 0; i < len; i++) {
      const attrName = this.resolveNameSpace(matches[i][1]);
      if (this.ignoreAttributesFn(attrName, jPathStr)) continue;
      let aName = options.attributeNamePrefix + attrName;
      if (attrName.length) {
        if (options.transformAttributeName) {
          aName = options.transformAttributeName(aName);
        }
        aName = sanitizeName(aName, options);
        if (matches[i][4] !== void 0) {
          const oldVal = processedVals[i];
          const newVal = options.attributeValueProcessor(attrName, oldVal, jPathStr);
          if (newVal === null || newVal === void 0) {
            attrs[aName] = oldVal;
          } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
            attrs[aName] = newVal;
          } else {
            attrs[aName] = parseValue(oldVal, options.parseAttributeValue, options.numberParseOptions);
          }
          hasAttrs = true;
        } else if (options.allowBooleanAttributes) {
          attrs[aName] = true;
          hasAttrs = true;
        }
      }
    }
    if (!hasAttrs) return;
    if (options.attributesGroupName && !options.preserveOrder) {
      const attrCollection = {};
      attrCollection[options.attributesGroupName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}
function addChild(currentNode, childNode, matcher, startIndex) {
  if (!this.options.captureMetaData) startIndex = void 0;
  const jPathOrMatcher = this.options.jPath ? matcher.toString() : matcher;
  const result = this.options.updateTag(childNode.tagname, jPathOrMatcher, childNode[":@"]);
  if (result === false) {
  } else if (typeof result === "string") {
    childNode.tagname = result;
    currentNode.addChild(childNode, startIndex);
  } else {
    currentNode.addChild(childNode, startIndex);
  }
}
function replaceEntitiesValue(val, tagName, jPath) {
  const entityConfig = this.options.processEntities;
  if (!entityConfig || !entityConfig.enabled) {
    return val;
  }
  if (entityConfig.allowedTags) {
    const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
    const allowed = Array.isArray(entityConfig.allowedTags) ? entityConfig.allowedTags.includes(tagName) : entityConfig.allowedTags(tagName, jPathOrMatcher);
    if (!allowed) {
      return val;
    }
  }
  if (entityConfig.tagFilter) {
    const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
    if (!entityConfig.tagFilter(tagName, jPathOrMatcher)) {
      return val;
    }
  }
  return this.entityDecoder.decode(val);
}
function saveTextToParentTag(textData, parentNode, matcher, isLeafNode) {
  if (textData) {
    if (isLeafNode === void 0) isLeafNode = parentNode.child.length === 0;
    textData = this.parseTextData(
      textData,
      parentNode.tagname,
      matcher,
      false,
      parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false,
      isLeafNode
    );
    if (textData !== void 0 && textData !== "")
      parentNode.add(this.options.textNodeName, textData);
    textData = "";
  }
  return textData;
}
function isItStopNode() {
  if (this.stopNodeExpressionsSet.size === 0) return false;
  return this.matcher.matchesAny(this.stopNodeExpressionsSet);
}
function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
  let attrBoundary = 0;
  const len = xmlData.length;
  const closeCode0 = closingChar.charCodeAt(0);
  const closeCode1 = closingChar.length > 1 ? closingChar.charCodeAt(1) : -1;
  let result = "";
  let segmentStart = i;
  for (let index = i; index < len; index++) {
    const code = xmlData.charCodeAt(index);
    if (attrBoundary) {
      if (code === attrBoundary) attrBoundary = 0;
    } else if (code === 34 || code === 39) {
      attrBoundary = code;
    } else if (code === closeCode0) {
      if (closeCode1 !== -1) {
        if (xmlData.charCodeAt(index + 1) === closeCode1) {
          result += xmlData.substring(segmentStart, index);
          return { data: result, index };
        }
      } else {
        result += xmlData.substring(segmentStart, index);
        return { data: result, index };
      }
    } else if (code === 9 && !attrBoundary) {
      result += xmlData.substring(segmentStart, index) + " ";
      segmentStart = index + 1;
    }
  }
}
function findClosingIndex(xmlData, str, i, errMsg) {
  const closingIndex = xmlData.indexOf(str, i);
  if (closingIndex === -1) {
    throw new Error(errMsg);
  } else {
    return closingIndex + str.length - 1;
  }
}
function findClosingChar(xmlData, char, i, errMsg) {
  const closingIndex = xmlData.indexOf(char, i);
  if (closingIndex === -1) throw new Error(errMsg);
  return closingIndex;
}
function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
  const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
  if (!result) return;
  let tagExp = result.data;
  const closeIndex = result.index;
  const separatorIndex = tagExp.search(/\s/);
  let tagName = tagExp;
  let attrExpPresent = true;
  if (separatorIndex !== -1) {
    tagName = tagExp.substring(0, separatorIndex);
    tagExp = tagExp.substring(separatorIndex + 1).trimStart();
  }
  const rawTagName = tagName;
  if (removeNSPrefix) {
    const colonIndex = tagName.indexOf(":");
    if (colonIndex !== -1) {
      tagName = tagName.substr(colonIndex + 1);
      attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
    }
  }
  return {
    tagName,
    tagExp,
    closeIndex,
    attrExpPresent,
    rawTagName
  };
}
function readStopNodeData(xmlData, tagName, i) {
  const startIndex = i;
  let openTagCount = 1;
  const xmllen = xmlData.length;
  for (; i < xmllen; i++) {
    if (xmlData[i] === "<") {
      const c1 = xmlData.charCodeAt(i + 1);
      if (c1 === 47) {
        const closeIndex = findClosingChar(xmlData, ">", i, `${tagName} is not closed`);
        let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
        if (closeTagName === tagName) {
          openTagCount--;
          if (openTagCount === 0) {
            return {
              tagContent: xmlData.substring(startIndex, i),
              i: closeIndex
            };
          }
        }
        i = closeIndex;
      } else if (c1 === 63) {
        const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
        i = closeIndex;
      } else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 45 && xmlData.charCodeAt(i + 3) === 45) {
        const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
        i = closeIndex;
      } else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 91) {
        const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
        i = closeIndex;
      } else {
        const tagData = readTagExp(xmlData, i, false);
        if (tagData) {
          const openTagName = tagData && tagData.tagName;
          if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
            openTagCount++;
          }
          i = tagData.closeIndex;
        }
      }
    }
  }
}
function parseValue(val, shouldParse, options) {
  if (shouldParse && typeof val === "string") {
    const newval = val.trim();
    if (newval === "true") return true;
    else if (newval === "false") return false;
    else return toNumber(val, options);
  } else {
    if (isExist(val)) {
      return val;
    } else {
      return "";
    }
  }
}
function transformTagName(fn, tagName, tagExp, options) {
  if (fn) {
    const newTagName = fn(tagName);
    if (tagExp === tagName) {
      tagExp = newTagName;
    }
    tagName = newTagName;
  }
  tagName = sanitizeName(tagName, options);
  return { tagName, tagExp };
}
function sanitizeName(name, options) {
  if (criticalProperties.includes(name)) {
    throw new Error(`[SECURITY] Invalid name: "${name}" is a reserved JavaScript keyword that could cause prototype pollution`);
  } else if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
    return options.onDangerousProperty(name);
  }
  return name;
}
var OrderedObjParser, attrsRegx, parseXml;
var init_OrderedObjParser = __esm({
  "node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"() {
    "use strict";
    init_util();
    init_xmlNode();
    init_DocTypeReader();
    init_strnum();
    init_ignoreAttributes();
    init_src3();
    init_src3();
    init_src();
    init_src4();
    OrderedObjParser = class {
      constructor(options, externalEntities) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
        this.entityExpansionCount = 0;
        this.currentExpandedLength = 0;
        this.doctypefound = false;
        let namedEntities = { ...XML };
        if (this.options.entityDecoder) {
          this.entityDecoder = this.options.entityDecoder;
        } else {
          if (typeof this.options.htmlEntities === "object") namedEntities = this.options.htmlEntities;
          else if (this.options.htmlEntities === true) namedEntities = { ...COMMON_HTML, ...CURRENCY };
          this.entityDecoder = new EntityDecoder({
            namedEntities: { ...namedEntities, ...externalEntities },
            numericAllowed: this.options.htmlEntities,
            limit: {
              maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
              maxExpandedLength: this.options.processEntities.maxExpandedLength,
              applyLimitsTo: this.options.processEntities.appliesTo
            },
            // onExternalEntity: (name, value) => isUnsafe(value) ? 'block' : 'allow',
            onInputEntity: (name, value) => (
              //TODO: VALID_CONTEXTS.HTML should be set only if this.options.htmlEntities
              isUnsafe(value, [html_default, xml_default]) ? ENTITY_ACTION.BLOCK : ENTITY_ACTION.ALLOW
            )
            //postCheck: resolved => resolved
          });
        }
        this.matcher = new Matcher();
        this.readonlyMatcher = this.matcher.readOnly();
        this.isCurrentNodeStopNode = false;
        this.stopNodeExpressionsSet = new ExpressionSet();
        const stopNodesOpts = this.options.stopNodes;
        if (stopNodesOpts && stopNodesOpts.length > 0) {
          for (let i = 0; i < stopNodesOpts.length; i++) {
            const stopNodeExp = stopNodesOpts[i];
            if (typeof stopNodeExp === "string") {
              this.stopNodeExpressionsSet.add(new Expression(stopNodeExp));
            } else if (stopNodeExp instanceof Expression) {
              this.stopNodeExpressionsSet.add(stopNodeExp);
            }
          }
          this.stopNodeExpressionsSet.seal();
        }
      }
    };
    attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    parseXml = function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new XmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      this.matcher.reset();
      this.entityDecoder.reset();
      this.entityExpansionCount = 0;
      this.currentExpandedLength = 0;
      this.doctypefound = false;
      const options = this.options;
      const docTypeReader = new DocTypeReader(options.processEntities);
      const xmlLen = xmlData.length;
      for (let i = 0; i < xmlLen; i++) {
        const ch = xmlData[i];
        if (ch === "<") {
          const c1 = xmlData.charCodeAt(i + 1);
          if (c1 === 47) {
            const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i + 2, closeIndex).trim();
            if (options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            tagName = transformTagName(options.transformTagName, tagName, "", options).tagName;
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
            }
            const lastTagName = this.matcher.getCurrentTag();
            if (tagName && options.unpairedTagsSet.has(tagName)) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            if (lastTagName && options.unpairedTagsSet.has(lastTagName)) {
              this.matcher.pop();
              this.tagsNodeStack.pop();
            }
            this.matcher.pop();
            this.isCurrentNodeStopNode = false;
            currentNode = this.tagsNodeStack.pop() || xmlObj;
            if (options.captureMetaData && currentNode) {
              currentNode.addEndIndex(closeIndex + 1);
            }
            textData = "";
            i = closeIndex;
          } else if (c1 === 63) {
            let tagData = readTagExp(xmlData, i, false, "?>");
            if (!tagData) throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
            const attsMap = this.buildAttributesMap(tagData.tagExp, this.matcher, tagData.tagName, true);
            if (attsMap) {
              const ver = attsMap[this.options.attributeNamePrefix + "version"];
              this.entityDecoder.setXmlVersion(Number(ver) || 1);
              docTypeReader.setXmlVersion(Number(ver) || 1);
            }
            if (options.ignoreDeclaration && tagData.tagName === "?xml" || options.ignorePiTags) {
            } else {
              const childNode = new XmlNode(tagData.tagName);
              childNode.add(options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent && options.ignoreAttributes !== true) {
                childNode[":@"] = attsMap;
              }
              this.addChild(currentNode, childNode, this.readonlyMatcher, i);
              if (options.captureMetaData) {
                currentNode.addEndIndex(tagData.closeIndex + 2);
              }
            }
            i = tagData.closeIndex + 1;
          } else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 45 && xmlData.charCodeAt(i + 3) === 45) {
            const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
            if (options.commentPropName) {
              const comment = xmlData.substring(i + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
              currentNode.add(options.commentPropName, [{ [options.textNodeName]: comment }]);
            }
            i = endIndex;
          } else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 68) {
            if (this.doctypefound) throw new Error("Multiple DOCTYPE declarations found.");
            this.doctypefound = true;
            const result = docTypeReader.readDocType(xmlData, i);
            this.entityDecoder.addInputEntities(result.entities);
            i = result.i;
          } else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 91) {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
            let val = this.parseTextData(tagExp, currentNode.tagname, this.readonlyMatcher, true, false, true, true);
            if (val == void 0) val = "";
            if (options.cdataPropName) {
              currentNode.add(options.cdataPropName, [{ [options.textNodeName]: tagExp }]);
            } else {
              currentNode.add(options.textNodeName, val);
            }
            i = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i, options.removeNSPrefix);
            if (!result) {
              const context = xmlData.substring(Math.max(0, i - 50), Math.min(xmlLen, i + 50));
              throw new Error(`readTagExp returned undefined at position ${i}. Context: "${context}"`);
            }
            let tagName = result.tagName;
            const rawTagName = result.rawTagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            ({ tagName, tagExp } = transformTagName(options.transformTagName, tagName, tagExp, options));
            if (options.strictReservedNames && (tagName === options.commentPropName || tagName === options.cdataPropName || tagName === options.textNodeName || tagName === options.attributesGroupName)) {
              throw new Error(`Invalid tag name: ${tagName}`);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && options.unpairedTagsSet.has(lastTag.tagname)) {
              currentNode = this.tagsNodeStack.pop();
              this.matcher.pop();
            }
            let isSelfClosing = false;
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              isSelfClosing = true;
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              attrExpPresent = tagName !== tagExp;
            }
            let prefixedAttrs = null;
            let rawAttrs = {};
            let namespace = void 0;
            namespace = extractNamespace(rawTagName);
            if (tagName !== xmlObj.tagname) {
              this.matcher.push(tagName, {}, namespace);
            }
            if (tagName !== tagExp && attrExpPresent) {
              prefixedAttrs = this.buildAttributesMap(tagExp, this.matcher, tagName);
              if (prefixedAttrs) {
                rawAttrs = extractRawAttributes(prefixedAttrs, options);
              }
            }
            if (tagName !== xmlObj.tagname) {
              this.isCurrentNodeStopNode = this.isItStopNode();
            }
            const startIndex = i;
            if (this.isCurrentNodeStopNode) {
              let tagContent = "";
              if (isSelfClosing) {
                i = result.closeIndex;
              } else if (options.unpairedTagsSet.has(tagName)) {
                i = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
                i = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new XmlNode(tagName);
              if (prefixedAttrs) {
                childNode[":@"] = prefixedAttrs;
              }
              childNode.add(options.textNodeName, tagContent);
              this.matcher.pop();
              this.isCurrentNodeStopNode = false;
              this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
              if (options.captureMetaData) {
                currentNode.addEndIndex(i + 1);
              }
            } else {
              if (isSelfClosing) {
                ({ tagName, tagExp } = transformTagName(options.transformTagName, tagName, tagExp, options));
                const childNode = new XmlNode(tagName);
                if (prefixedAttrs) {
                  childNode[":@"] = prefixedAttrs;
                }
                this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
                if (options.captureMetaData) {
                  currentNode.addEndIndex(closeIndex + 1);
                }
                this.matcher.pop();
                this.isCurrentNodeStopNode = false;
              } else if (options.unpairedTagsSet.has(tagName)) {
                const childNode = new XmlNode(tagName);
                if (prefixedAttrs) {
                  childNode[":@"] = prefixedAttrs;
                }
                this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
                if (options.captureMetaData) {
                  currentNode.addEndIndex(result.closeIndex + 1);
                }
                this.matcher.pop();
                this.isCurrentNodeStopNode = false;
                i = result.closeIndex;
                continue;
              } else {
                const childNode = new XmlNode(tagName);
                if (this.tagsNodeStack.length > options.maxNestedTags) {
                  throw new Error("Maximum nested tags exceeded");
                }
                this.tagsNodeStack.push(currentNode);
                if (prefixedAttrs) {
                  childNode[":@"] = prefixedAttrs;
                }
                this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
                currentNode = childNode;
              }
              textData = "";
              i = closeIndex;
            }
          }
        } else {
          textData += xmlData[i];
        }
      }
      return xmlObj.child;
    };
  }
});

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
function stripAttributePrefix(attrs, prefix) {
  if (!attrs || typeof attrs !== "object") return {};
  if (!prefix) return attrs;
  const rawAttrs = {};
  for (const key in attrs) {
    if (key.startsWith(prefix)) {
      const rawName = key.substring(prefix.length);
      rawAttrs[rawName] = attrs[key];
    } else {
      rawAttrs[key] = attrs[key];
    }
  }
  return rawAttrs;
}
function prettify(node, options, matcher, readonlyMatcher) {
  return compress(node, options, matcher, readonlyMatcher);
}
function compress(arr, options, matcher, readonlyMatcher) {
  let text;
  const compressedObj = {};
  for (let i = 0; i < arr.length; i++) {
    const tagObj = arr[i];
    const property = propName(tagObj);
    if (property !== void 0 && property !== options.textNodeName) {
      const rawAttrs = stripAttributePrefix(
        tagObj[":@"] || {},
        options.attributeNamePrefix
      );
      matcher.push(property, rawAttrs);
    }
    if (property === options.textNodeName) {
      if (text === void 0) text = tagObj[property];
      else text += "" + tagObj[property];
    } else if (property === void 0) {
      continue;
    } else if (tagObj[property]) {
      let val = compress(tagObj[property], options, matcher, readonlyMatcher);
      const isLeaf = isLeafTag(val, options);
      if (Object.keys(val).length === 0 && options.alwaysCreateTextNode) {
        val[options.textNodeName] = "";
      }
      if (tagObj[":@"]) {
        assignAttributes(val, tagObj[":@"], readonlyMatcher, options);
      } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
        val = val[options.textNodeName];
      } else if (Object.keys(val).length === 0) {
        if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
        else val = "";
      }
      if (tagObj[METADATA_SYMBOL2] !== void 0 && typeof val === "object" && val !== null) {
        val[METADATA_SYMBOL2] = tagObj[METADATA_SYMBOL2];
      }
      if (compressedObj[property] !== void 0 && Object.prototype.hasOwnProperty.call(compressedObj, property)) {
        if (!Array.isArray(compressedObj[property])) {
          compressedObj[property] = [compressedObj[property]];
        }
        compressedObj[property].push(val);
      } else {
        const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() : readonlyMatcher;
        if (options.isArray(property, jPathOrMatcher, isLeaf)) {
          compressedObj[property] = [val];
        } else {
          compressedObj[property] = val;
        }
      }
      if (property !== void 0 && property !== options.textNodeName) {
        matcher.pop();
      }
    }
  }
  if (typeof text === "string") {
    if (text.length > 0) compressedObj[options.textNodeName] = text;
  } else if (text !== void 0) compressedObj[options.textNodeName] = text;
  return compressedObj;
}
function propName(obj) {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key !== ":@") return key;
  }
}
function assignAttributes(obj, attrMap, readonlyMatcher, options) {
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      const atrrName = keys[i];
      const rawAttrName = atrrName.startsWith(options.attributeNamePrefix) ? atrrName.substring(options.attributeNamePrefix.length) : atrrName;
      const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() + "." + rawAttrName : readonlyMatcher;
      if (options.isArray(atrrName, jPathOrMatcher, true, true)) {
        obj[atrrName] = [attrMap[atrrName]];
      } else {
        obj[atrrName] = attrMap[atrrName];
      }
    }
  }
}
function isLeafTag(obj, options) {
  const { textNodeName } = options;
  const propCount = Object.keys(obj).length;
  if (propCount === 0) {
    return true;
  }
  if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
    return true;
  }
  return false;
}
var METADATA_SYMBOL2;
var init_node2json = __esm({
  "node_modules/fast-xml-parser/src/xmlparser/node2json.js"() {
    "use strict";
    init_xmlNode();
    METADATA_SYMBOL2 = XmlNode.getMetaDataSymbol();
  }
});

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var XMLParser;
var init_XMLParser = __esm({
  "node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"() {
    init_OptionsBuilder();
    init_OrderedObjParser();
    init_node2json();
    init_validator();
    init_xmlNode();
    XMLParser = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object
       * @param {string|Uint8Array} xmlData
       * @param {boolean|Object} validationOption
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData !== "string" && xmlData.toString) {
          xmlData = xmlData.toString();
        } else if (typeof xmlData !== "string") {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true) validationOption = {};
          const result = validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options, this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
        else return prettify(orderedResult, this.options, orderedObjParser.matcher, orderedObjParser.readonlyMatcher);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key
       * @param {string} value
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
      /**
       * Returns a Symbol that can be used to access the metadata
       * property on a node.
       *
       * If Symbol is not available in the environment, an ordinary property is used
       * and the name of the property is here returned.
       *
       * The XMLMetaData property is only present when `captureMetaData`
       * is true in the options.
       */
      static getMetaDataSymbol() {
        return XmlNode.getMetaDataSymbol();
      }
    };
  }
});

// node_modules/fast-xml-parser/src/fxp.js
var init_fxp = __esm({
  "node_modules/fast-xml-parser/src/fxp.js"() {
    "use strict";
    init_XMLParser();
  }
});

// src/fmi-parser.js
function asArray(value) {
  if (value === void 0 || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
function getHrefAttribute(object) {
  if (!object || typeof object !== "object") {
    return null;
  }
  const key = Object.keys(object).find(
    (name) => name.toLowerCase().endsWith("href")
  );
  return key ? object[key] : null;
}
function getParameterName(href) {
  if (!href) {
    return null;
  }
  try {
    const url = new URL(href);
    return url.searchParams.get("param");
  } catch {
    const match = href.match(/[?&]param=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}
function parseFmiTimeValuePairXml(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true,
    parseTagValue: false,
    trimValues: true
  });
  const document = parser.parse(xml);
  const members = asArray(document?.FeatureCollection?.member);
  const parameters = /* @__PURE__ */ new Map();
  for (const member of members) {
    const observation = member?.PointTimeSeriesObservation;
    if (!observation) {
      continue;
    }
    const href = getHrefAttribute(observation.observedProperty);
    const parameterName = getParameterName(href);
    if (!parameterName) {
      continue;
    }
    const points = asArray(
      observation?.result?.MeasurementTimeseries?.point
    );
    const values = [];
    for (const point of points) {
      const measurement = point?.MeasurementTVP;
      if (!measurement?.time) {
        continue;
      }
      const rawValue = measurement.value;
      const numericValue = Number(rawValue);
      values.push({
        time: measurement.time,
        value: Number.isFinite(numericValue) ? numericValue : null
      });
    }
    parameters.set(parameterName, values);
  }
  return parameters;
}
var init_fmi_parser = __esm({
  "src/fmi-parser.js"() {
    init_fxp();
  }
});

// src/fmi-weather.js
function buildWeatherTimeline(parameters) {
  if (!(parameters instanceof Map)) {
    throw new TypeError("FMI parameters must be provided as a Map");
  }
  const timelineByTime = /* @__PURE__ */ new Map();
  for (const [sourceParameter, targetField] of Object.entries(PARAMETER_MAP)) {
    const values = parameters.get(sourceParameter);
    if (!Array.isArray(values)) {
      continue;
    }
    for (const entry of values) {
      if (!entry?.time) {
        continue;
      }
      if (!timelineByTime.has(entry.time)) {
        timelineByTime.set(entry.time, {
          time: entry.time
        });
      }
      timelineByTime.get(entry.time)[targetField] = entry.value;
    }
  }
  return [...timelineByTime.values()].sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );
}
var PARAMETER_MAP;
var init_fmi_weather = __esm({
  "src/fmi-weather.js"() {
    PARAMETER_MAP = {
      // FMI HARMONIE forecast parameters.
      Temperature: "temperature",
      Humidity: "humidity",
      WindDirection: "windDirection",
      WindSpeedMS: "windSpeed",
      PrecipitationAmount: "cumulativePrecipitation",
      Precipitation1h: "precipitation",
      TotalCloudCover: "cloudCover",
      Visibility: "visibility",
      WindGust: "windGust",
      Pressure: "pressure",
      DewPoint: "dewPoint",
      WeatherSymbol3: "weatherSymbol",
      // FMI surface-weather observation parameters.
      t2m: "temperature",
      rh: "humidity",
      wd_10min: "windDirection",
      ws_10min: "windSpeed",
      wg_10min: "windGust",
      r_1h: "precipitation",
      vis: "visibility",
      p_sea: "pressure",
      td: "dewPoint"
    };
  }
});

// src/fmi-service.js
function isCompleteCurrentObservation(observation) {
  const requiredFields = [
    "temperature",
    "humidity",
    "windDirection",
    "windSpeed"
  ];
  return requiredFields.every(
    (field) => typeof observation?.[field] === "number" && Number.isFinite(observation[field])
  );
}
async function getCurrentWeather(place, fetchImpl = fetch) {
  const xml = await fetchFmiObservations(place, fetchImpl);
  const parameters = parseFmiTimeValuePairXml(xml);
  const timeline = buildWeatherTimeline(parameters);
  for (let index = timeline.length - 1; index >= 0; index -= 1) {
    const observation = timeline[index];
    if (isCompleteCurrentObservation(observation)) {
      return observation;
    }
  }
  return null;
}
async function getForecast(place, fetchImpl = fetch) {
  const xml = await fetchFmiForecast(place, fetchImpl);
  const parameters = parseFmiTimeValuePairXml(xml);
  return buildWeatherTimeline(parameters);
}
var init_fmi_service = __esm({
  "src/fmi-service.js"() {
    init_fmi_client();
    init_fmi_parser();
    init_fmi_weather();
  }
});

// src/magicmirror-weather.js
function mapFmiWeatherSymbol(weatherSymbol, daylight) {
  if (typeof daylight !== "boolean") {
    throw new TypeError("Daylight must be a boolean");
  }
  switch (weatherSymbol) {
    case 1:
      return daylight ? "day-sunny" : "night-clear";
    case 2:
      return daylight ? "day-cloudy" : "night-alt-cloudy";
    case 3:
      return "cloudy";
    case 21:
    case 22:
    case 23:
      return daylight ? "day-showers" : "night-alt-showers";
    case 31:
    case 32:
    case 33:
      return daylight ? "day-rain" : "night-alt-rain";
    case 41:
    case 42:
    case 43:
    case 51:
    case 52:
    case 53:
      return daylight ? "day-snow" : "night-alt-snow";
    case 61:
    case 62:
    case 63:
    case 64:
      return daylight ? "day-thunderstorm" : "night-alt-thunderstorm";
    default:
      return null;
  }
}
function findNearestWeatherSymbol(observationTime, forecastTimeline) {
  const observationTimestamp = Date.parse(observationTime);
  if (Number.isNaN(observationTimestamp)) {
    throw new TypeError(
      "Observation time must be a valid ISO 8601 timestamp"
    );
  }
  if (!Array.isArray(forecastTimeline)) {
    throw new TypeError("Forecast timeline must be an array");
  }
  const maxDifferenceMs = 90 * 60 * 1e3;
  let nearestSymbol = null;
  let nearestDifference = Infinity;
  let nearestTimestamp = Infinity;
  for (const entry of forecastTimeline) {
    if (entry === null || typeof entry !== "object" || typeof entry.weatherSymbol !== "number" || !Number.isFinite(entry.weatherSymbol)) {
      continue;
    }
    const forecastTimestamp = Date.parse(entry.time);
    if (Number.isNaN(forecastTimestamp)) {
      continue;
    }
    const difference = Math.abs(
      forecastTimestamp - observationTimestamp
    );
    if (difference <= maxDifferenceMs && (difference < nearestDifference || difference === nearestDifference && forecastTimestamp < nearestTimestamp)) {
      nearestSymbol = entry.weatherSymbol;
      nearestDifference = difference;
      nearestTimestamp = forecastTimestamp;
    }
  }
  return nearestSymbol;
}
var init_magicmirror_weather = __esm({
  "src/magicmirror-weather.js"() {
  }
});

// node_modules/sunrise-sunset-js/dist/index.js
function deg2rad(degrees) {
  return PI / 180 * degrees;
}
function rad2deg(radians) {
  return 180 / PI * radians;
}
function limitDegrees(degrees) {
  let limited = degrees / 360;
  limited = 360 * (limited - Math.floor(limited));
  if (limited < 0) limited += 360;
  return limited;
}
function limitDegrees180(degrees) {
  let limited = degrees / 180;
  limited = 180 * (limited - Math.floor(limited));
  if (limited < 0) limited += 180;
  return limited;
}
function limitDegrees180pm(degrees) {
  let limited = degrees / 360;
  limited = 360 * (limited - Math.floor(limited));
  if (limited < -180) limited += 360;
  else if (limited > 180) limited -= 360;
  return limited;
}
function limitZero2one(value) {
  let limited = value - Math.floor(value);
  if (limited < 0) limited += 1;
  return limited;
}
function thirdOrderPolynomial(a, b, c, d, x) {
  return ((a * x + b) * x + c) * x + d;
}
function limitMinutes(minutes) {
  let limited = minutes;
  if (limited < -20) limited += 1440;
  else if (limited > 20) limited -= 1440;
  return limited;
}
function dayfracToLocalHr(dayfrac, timezone) {
  return 24 * limitZero2one(dayfrac + timezone / 24);
}
function fractionalHourToDate(year, month, day, fractionalHour, timezone) {
  if (!isFinite(fractionalHour)) return /* @__PURE__ */ new Date(NaN);
  const localMidnightUtc = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  const utcMilliseconds = Math.round((fractionalHour - timezone) * 36e5);
  return new Date(localMidnightUtc + utcMilliseconds);
}
function getTimeZoneDateTimeFormatter(timezoneId) {
  let formatter = timeZoneDateTimeFormatters.get(timezoneId);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneId,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });
    timeZoneDateTimeFormatters.set(timezoneId, formatter);
  }
  return formatter;
}
function parseDateTimeComponents(date, formatter) {
  const values = /* @__PURE__ */ new Map();
  for (const part of formatter.formatToParts(date)) if (part.type !== "literal") values.set(part.type, part.value);
  return {
    year: parseInt(values.get("year") ?? "0", 10),
    month: parseInt(values.get("month") ?? "0", 10),
    day: parseInt(values.get("day") ?? "0", 10),
    hour: parseInt(values.get("hour") ?? "0", 10),
    minute: parseInt(values.get("minute") ?? "0", 10),
    second: parseInt(values.get("second") ?? "0", 10) + date.getUTCMilliseconds() / 1e3
  };
}
function getOffsetHoursFromComponents(date, components) {
  const wholeSeconds = Math.floor(components.second);
  const milliseconds = Math.round((components.second - wholeSeconds) * 1e3);
  return (Date.UTC(components.year, components.month - 1, components.day, components.hour, components.minute, wholeSeconds, milliseconds) - date.getTime()) / 36e5;
}
function julianDay(year, month, day, hour, minute, second, deltaUt1, timezone) {
  let y = year;
  let m = month;
  const dayDecimal = day + (hour - timezone + (minute + (second + deltaUt1) / 60) / 60) / 24;
  if (m < 3) {
    m += 12;
    y--;
  }
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayDecimal - 1524.5;
  if (jd > 2299160) {
    const a = Math.floor(y / 100);
    jd += 2 - a + Math.floor(a / 4);
  }
  return jd;
}
function julianCentury(jd) {
  return (jd - 2451545) / 36525;
}
function julianEphemerisDay(jd, deltaT) {
  return jd + deltaT / 86400;
}
function julianEphemerisCentury(jde) {
  return (jde - 2451545) / 36525;
}
function julianEphemerisMillennium(jce) {
  return jce / 10;
}
function extractLocalDateComponents(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds() + date.getMilliseconds() / 1e3,
    timezone: -date.getTimezoneOffset() / 60
  };
}
function extractFixedOffsetDateComponents(date, timezone) {
  const shifted = new Date(date.getTime() + timezone * 36e5);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds() + shifted.getUTCMilliseconds() / 1e3
  };
}
function extractTimeZoneDateComponents(date, timezoneId) {
  return parseDateTimeComponents(date, getTimeZoneDateTimeFormatter(timezoneId));
}
function resolveDateTimeComponents(date, timezone, timezoneId) {
  if (timezone !== void 0) return {
    ...extractFixedOffsetDateComponents(date, timezone),
    timezone
  };
  if (timezoneId) try {
    const components = extractTimeZoneDateComponents(date, timezoneId);
    return {
      ...components,
      timezone: getOffsetHoursFromComponents(date, components)
    };
  } catch {
  }
  return extractLocalDateComponents(date);
}
function earthPeriodicTermSummation(terms, count, jme) {
  let sum = 0;
  for (let i = 0; i < count; i++) sum += terms[i][0] * Math.cos(terms[i][1] + terms[i][2] * jme);
  return sum;
}
function earthValues(termSum, count, jme) {
  let sum = 0;
  for (let i = 0; i < count; i++) sum += termSum[i] * Math.pow(jme, i);
  sum /= 1e8;
  return sum;
}
function earthHeliocentricLongitude(jme) {
  const sum = [];
  for (let i = 0; i < 6; i++) sum[i] = earthPeriodicTermSummation(L_TERMS[i], L_SUBCOUNT[i], jme);
  return limitDegrees(rad2deg(earthValues(sum, 6, jme)));
}
function earthHeliocentricLatitude(jme) {
  const sum = [];
  for (let i = 0; i < 2; i++) sum[i] = earthPeriodicTermSummation(B_TERMS[i], B_SUBCOUNT[i], jme);
  return rad2deg(earthValues(sum, 2, jme));
}
function earthRadiusVector(jme) {
  const sum = [];
  for (let i = 0; i < 5; i++) sum[i] = earthPeriodicTermSummation(R_TERMS[i], R_SUBCOUNT[i], jme);
  return earthValues(sum, 5, jme);
}
function geocentricLongitude(l) {
  let theta = l + 180;
  if (theta >= 360) theta -= 360;
  return theta;
}
function geocentricLatitude(b) {
  return -b;
}
function aberrationCorrection(r) {
  return -20.4898 / (3600 * r);
}
function apparentSunLongitude(theta, deltaPsi, deltaTau) {
  return theta + deltaPsi + deltaTau;
}
function geocentricRightAscension(lamda, epsilon, beta) {
  const lamdaRad = deg2rad(lamda);
  const epsilonRad = deg2rad(epsilon);
  return limitDegrees(rad2deg(Math.atan2(Math.sin(lamdaRad) * Math.cos(epsilonRad) - Math.tan(deg2rad(beta)) * Math.sin(epsilonRad), Math.cos(lamdaRad))));
}
function geocentricDeclination(beta, epsilon, lamda) {
  const betaRad = deg2rad(beta);
  const epsilonRad = deg2rad(epsilon);
  return rad2deg(Math.asin(Math.sin(betaRad) * Math.cos(epsilonRad) + Math.cos(betaRad) * Math.sin(epsilonRad) * Math.sin(deg2rad(lamda))));
}
function sunMeanLongitude(jme) {
  return limitDegrees(280.4664567 + jme * (360007.6982779 + jme * (0.03032028 + jme * (1 / 49931 + jme * (-1 / 15300 + jme * (-1 / 2e6))))));
}
function sunEquatorialHorizontalParallax(r) {
  return 8.794 / (3600 * r);
}
function meanElongationMoonSun(jce) {
  return thirdOrderPolynomial(1 / 189474, -19142e-7, 445267.11148, 297.85036, jce);
}
function meanAnomalySun(jce) {
  return thirdOrderPolynomial(-1 / 3e5, -1603e-7, 35999.05034, 357.52772, jce);
}
function meanAnomalyMoon(jce) {
  return thirdOrderPolynomial(1 / 56250, 86972e-7, 477198.867398, 134.96298, jce);
}
function argumentLatitudeMoon(jce) {
  return thirdOrderPolynomial(1 / 327270, -36825e-7, 483202.017538, 93.27191, jce);
}
function ascendingLongitudeMoon(jce) {
  return thirdOrderPolynomial(1 / 45e4, 20708e-7, -1934.136261, 125.04452, jce);
}
function xyTermSummation(i, x) {
  let sum = 0;
  for (let j = 0; j < 5; j++) sum += x[j] * Y_TERMS[i][j];
  return sum;
}
function nutationLongitudeAndObliquity(jce, x) {
  let sumPsi = 0;
  let sumEpsilon = 0;
  for (let i = 0; i < 63; i++) {
    const xyTermSum = deg2rad(xyTermSummation(i, x));
    sumPsi += (PE_TERMS[i][0] + jce * PE_TERMS[i][1]) * Math.sin(xyTermSum);
    sumEpsilon += (PE_TERMS[i][2] + jce * PE_TERMS[i][3]) * Math.cos(xyTermSum);
  }
  return {
    delPsi: sumPsi / 36e6,
    delEpsilon: sumEpsilon / 36e6
  };
}
function eclipticMeanObliquity(jme) {
  const u = jme / 10;
  return 84381.448 + u * (-4680.93 + u * (-1.55 + u * (1999.25 + u * (-51.38 + u * (-249.67 + u * (-39.05 + u * (7.12 + u * (27.87 + u * (5.79 + u * 2.45)))))))));
}
function eclipticTrueObliquity(deltaEpsilon, epsilon0) {
  return deltaEpsilon + epsilon0 / 3600;
}
function greenwichMeanSiderealTime(jd, jc) {
  return limitDegrees(280.46061837 + 360.98564736629 * (jd - 2451545) + jc * jc * (387933e-9 - jc / 3871e4));
}
function greenwichSiderealTime(nu0, deltaPsi, epsilon) {
  return nu0 + deltaPsi * Math.cos(deg2rad(epsilon));
}
function observerHourAngle(nu, longitude, alphaDeg) {
  return limitDegrees(nu + longitude - alphaDeg);
}
function rightAscensionParallaxAndTopocentricDec(latitude, elevation, xi, h, delta) {
  const latRad = deg2rad(latitude);
  const xiRad = deg2rad(xi);
  const hRad = deg2rad(h);
  const deltaRad = deg2rad(delta);
  const u = Math.atan(0.99664719 * Math.tan(latRad));
  const y = 0.99664719 * Math.sin(u) + elevation * Math.sin(latRad) / 6378140;
  const x = Math.cos(u) + elevation * Math.cos(latRad) / 6378140;
  const deltaAlphaRad = Math.atan2(-x * Math.sin(xiRad) * Math.sin(hRad), Math.cos(deltaRad) - x * Math.sin(xiRad) * Math.cos(hRad));
  const deltaPrime = rad2deg(Math.atan2((Math.sin(deltaRad) - y * Math.sin(xiRad)) * Math.cos(deltaAlphaRad), Math.cos(deltaRad) - x * Math.sin(xiRad) * Math.cos(hRad)));
  return {
    deltaAlpha: rad2deg(deltaAlphaRad),
    deltaPrime
  };
}
function topocentricRightAscension(alphaDeg, deltaAlpha) {
  return alphaDeg + deltaAlpha;
}
function topocentricLocalHourAngle(h, deltaAlpha) {
  return h - deltaAlpha;
}
function topocentricElevationAngle(latitude, deltaPrime, hPrime) {
  const latRad = deg2rad(latitude);
  const deltaPrimeRad = deg2rad(deltaPrime);
  return rad2deg(Math.asin(Math.sin(latRad) * Math.sin(deltaPrimeRad) + Math.cos(latRad) * Math.cos(deltaPrimeRad) * Math.cos(deg2rad(hPrime))));
}
function atmosphericRefractionCorrection(pressure, temperature, atmosphericRefraction, e0) {
  let delE = 0;
  if (e0 >= -1 * (0.26667 + atmosphericRefraction)) delE = pressure / 1010 * (283 / (273 + temperature)) * (1.02 / (60 * Math.tan(deg2rad(e0 + 10.3 / (e0 + 5.11)))));
  return delE;
}
function topocentricElevationAngleCorrected(e0, deltaE) {
  return e0 + deltaE;
}
function topocentricZenithAngle(e) {
  return 90 - e;
}
function topocentricAzimuthAngleAstro(hPrime, latitude, deltaPrime) {
  const hPrimeRad = deg2rad(hPrime);
  const latRad = deg2rad(latitude);
  return limitDegrees(rad2deg(Math.atan2(Math.sin(hPrimeRad), Math.cos(hPrimeRad) * Math.sin(latRad) - Math.tan(deg2rad(deltaPrime)) * Math.cos(latRad))));
}
function topocentricAzimuthAngle(azimuthAstro) {
  return limitDegrees(azimuthAstro + 180);
}
function surfaceIncidenceAngle(zenith, azimuthAstro, azimuthRotation, slope) {
  const zenithRad = deg2rad(zenith);
  const slopeRad = deg2rad(slope);
  return rad2deg(Math.acos(Math.cos(zenithRad) * Math.cos(slopeRad) + Math.sin(slopeRad) * Math.sin(zenithRad) * Math.cos(deg2rad(azimuthAstro - azimuthRotation))));
}
function sunHourAngleAtRiseSet(latitude, deltaZero, h0Prime) {
  const latitudeRad = deg2rad(latitude);
  const deltaZeroRad = deg2rad(deltaZero);
  const argument = (Math.sin(deg2rad(h0Prime)) - Math.sin(latitudeRad) * Math.sin(deltaZeroRad)) / (Math.cos(latitudeRad) * Math.cos(deltaZeroRad));
  if (Math.abs(argument) <= 1) return limitDegrees180(rad2deg(Math.acos(argument)));
  return INVALID_VALUE;
}
function approxSunTransitTime(alphaZero, longitude, nu) {
  return (alphaZero - longitude - nu) / 360;
}
function approxSunRiseAndSet(mRts, h0) {
  const h0Dfrac = h0 / 360;
  mRts[1] = limitZero2one(mRts[0] - h0Dfrac);
  mRts[2] = limitZero2one(mRts[0] + h0Dfrac);
  mRts[0] = limitZero2one(mRts[0]);
}
function rtsAlphaDeltaPrime(ad, n) {
  let a = ad[1] - ad[0];
  let b = ad[2] - ad[1];
  if (Math.abs(a) >= 2) a = limitZero2one(a);
  if (Math.abs(b) >= 2) b = limitZero2one(b);
  return ad[1] + n * (a + b + (b - a) * n) / 2;
}
function rtsSunAltitude(latitude, deltaPrime, hPrime) {
  const latitudeRad = deg2rad(latitude);
  const deltaPrimeRad = deg2rad(deltaPrime);
  return rad2deg(Math.asin(Math.sin(latitudeRad) * Math.sin(deltaPrimeRad) + Math.cos(latitudeRad) * Math.cos(deltaPrimeRad) * Math.cos(deg2rad(hPrime))));
}
function sunRiseAndSet(mRts, hRts, deltaPrime, latitude, hPrime, h0Prime, sun) {
  return mRts[sun] + (hRts[sun] - h0Prime) / (360 * Math.cos(deg2rad(deltaPrime[sun])) * Math.cos(deg2rad(latitude)) * Math.sin(deg2rad(hPrime[sun])));
}
function equationOfTime(m, alpha, delPsi, epsilon) {
  return limitMinutes(4 * (m - 57183e-7 - alpha + delPsi * Math.cos(deg2rad(epsilon))));
}
function calculateEotAndSunRiseTransitSet(spa, calculateRaDec) {
  const h0Prime = -1 * (SUN_RADIUS + spa.atmosphericRefraction);
  const sunRtsJd = julianDay(spa.year, spa.month, spa.day, 0, 0, 0, 0, 0);
  const nu = calculateRaDec(sunRtsJd, spa.deltaT).nu;
  const eot = equationOfTime(sunMeanLongitude(spa.jme), spa.alpha, spa.delPsi, spa.epsilon);
  const alpha = [];
  const delta = [];
  for (let i = 0; i < 3; i++) {
    const result = calculateRaDec(sunRtsJd + i - 1, spa.deltaT);
    alpha[i] = result.alpha;
    delta[i] = result.delta;
  }
  const mRts = [];
  mRts[0] = approxSunTransitTime(alpha[1], spa.longitude, nu);
  const h0 = sunHourAngleAtRiseSet(spa.latitude, delta[1], h0Prime);
  const polar = h0 === INVALID_VALUE;
  if (polar) mRts[0] = limitZero2one(mRts[0]);
  else approxSunRiseAndSet(mRts, h0);
  const nuRts = [];
  const hPrime = [];
  const alphaPrime = [];
  const deltaPrime = [];
  const hRts = [];
  const rtsCount = polar ? 1 : 3;
  for (let i = 0; i < rtsCount; i++) {
    nuRts[i] = nu + 360.985647 * mRts[i];
    const n = mRts[i] + spa.deltaT / 86400;
    alphaPrime[i] = rtsAlphaDeltaPrime(alpha, n);
    deltaPrime[i] = rtsAlphaDeltaPrime(delta, n);
    hPrime[i] = limitDegrees180pm(nuRts[i] + spa.longitude - alphaPrime[i]);
    hRts[i] = rtsSunAltitude(spa.latitude, deltaPrime[i], hPrime[i]);
  }
  const sta = hRts[0];
  const suntransit = dayfracToLocalHr(mRts[0] - hPrime[0] / 360, spa.timezone);
  if (polar) return {
    sunrise: INVALID_VALUE,
    suntransit,
    sunset: INVALID_VALUE,
    srha: INVALID_VALUE,
    ssha: INVALID_VALUE,
    sta,
    eot
  };
  const srha = hPrime[1];
  const ssha = hPrime[2];
  return {
    sunrise: dayfracToLocalHr(sunRiseAndSet(mRts, hRts, deltaPrime, spa.latitude, hPrime, h0Prime, 1), spa.timezone),
    suntransit,
    sunset: dayfracToLocalHr(sunRiseAndSet(mRts, hRts, deltaPrime, spa.latitude, hPrime, h0Prime, 2), spa.timezone),
    srha,
    ssha,
    sta,
    eot
  };
}
function createSpaData() {
  return {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    deltaUt1: 0,
    deltaT: 67,
    timezone: 0,
    longitude: 0,
    latitude: 0,
    elevation: 0,
    pressure: 1013,
    temperature: 15,
    slope: 0,
    azimuthRotation: 0,
    atmosphericRefraction: REFRACTION_CORRECTION,
    timezoneId: "",
    function: 3,
    jd: 0,
    jc: 0,
    jde: 0,
    jce: 0,
    jme: 0,
    l: 0,
    b: 0,
    r: 0,
    theta: 0,
    beta: 0,
    x0: 0,
    x1: 0,
    x2: 0,
    x3: 0,
    x4: 0,
    delPsi: 0,
    delEpsilon: 0,
    epsilon0: 0,
    epsilon: 0,
    delTau: 0,
    lamda: 0,
    nu0: 0,
    nu: 0,
    alpha: 0,
    delta: 0,
    h: 0,
    xi: 0,
    delAlpha: 0,
    deltaPrime: 0,
    alphaPrime: 0,
    hPrime: 0,
    e0: 0,
    delE: 0,
    e: 0,
    eot: 0,
    srha: 0,
    ssha: 0,
    sta: 0,
    zenith: 0,
    azimuthAstro: 0,
    azimuth: 0,
    incidence: 0,
    suntransit: 0,
    sunrise: 0,
    sunset: 0
  };
}
function validateInputs(spa) {
  if (spa.year < -2e3 || spa.year > 6e3) return 1;
  if (spa.month < 1 || spa.month > 12) return 2;
  if (spa.day < 1 || spa.day > 31) return 3;
  if (spa.hour < 0 || spa.hour > 24) return 4;
  if (spa.minute < 0 || spa.minute > 59) return 5;
  if (spa.second < 0 || spa.second >= 60) return 6;
  if (spa.pressure < 0 || spa.pressure > 5e3) return 12;
  if (spa.temperature <= -273 || spa.temperature > 6e3) return 13;
  if (spa.deltaUt1 <= -1 || spa.deltaUt1 >= 1) return 17;
  if (spa.hour === 24 && spa.minute > 0) return 5;
  if (spa.hour === 24 && spa.second > 0) return 6;
  if (Math.abs(spa.deltaT) > 8e3) return 7;
  if (Math.abs(spa.timezone) > 18) return 8;
  if (Math.abs(spa.longitude) > 180) return 9;
  if (Math.abs(spa.latitude) > 90) return 10;
  if (Math.abs(spa.atmosphericRefraction) > 5) return 16;
  if (spa.elevation < -65e5) return 11;
  return 0;
}
function calculateGeocentricSunRaAndDec(spa) {
  spa.jc = julianCentury(spa.jd);
  spa.jde = julianEphemerisDay(spa.jd, spa.deltaT);
  spa.jce = julianEphemerisCentury(spa.jde);
  spa.jme = julianEphemerisMillennium(spa.jce);
  spa.l = earthHeliocentricLongitude(spa.jme);
  spa.b = earthHeliocentricLatitude(spa.jme);
  spa.r = earthRadiusVector(spa.jme);
  spa.theta = geocentricLongitude(spa.l);
  spa.beta = geocentricLatitude(spa.b);
  spa.x0 = meanElongationMoonSun(spa.jce);
  spa.x1 = meanAnomalySun(spa.jce);
  spa.x2 = meanAnomalyMoon(spa.jce);
  spa.x3 = argumentLatitudeMoon(spa.jce);
  spa.x4 = ascendingLongitudeMoon(spa.jce);
  const x = [
    spa.x0,
    spa.x1,
    spa.x2,
    spa.x3,
    spa.x4
  ];
  const nutation = nutationLongitudeAndObliquity(spa.jce, x);
  spa.delPsi = nutation.delPsi;
  spa.delEpsilon = nutation.delEpsilon;
  spa.epsilon0 = eclipticMeanObliquity(spa.jme);
  spa.epsilon = eclipticTrueObliquity(spa.delEpsilon, spa.epsilon0);
  spa.delTau = aberrationCorrection(spa.r);
  spa.lamda = apparentSunLongitude(spa.theta, spa.delPsi, spa.delTau);
  spa.nu0 = greenwichMeanSiderealTime(spa.jd, spa.jc);
  spa.nu = greenwichSiderealTime(spa.nu0, spa.delPsi, spa.epsilon);
  spa.alpha = geocentricRightAscension(spa.lamda, spa.epsilon, spa.beta);
  spa.delta = geocentricDeclination(spa.beta, spa.epsilon, spa.lamda);
}
function calculateRaDecForJd(jd, deltaT) {
  const jc = julianCentury(jd);
  const jce = julianEphemerisCentury(julianEphemerisDay(jd, deltaT));
  const jme = julianEphemerisMillennium(jce);
  const l = earthHeliocentricLongitude(jme);
  const b = earthHeliocentricLatitude(jme);
  const r = earthRadiusVector(jme);
  const theta = geocentricLongitude(l);
  const beta = geocentricLatitude(b);
  const nutation = nutationLongitudeAndObliquity(jce, [
    meanElongationMoonSun(jce),
    meanAnomalySun(jce),
    meanAnomalyMoon(jce),
    argumentLatitudeMoon(jce),
    ascendingLongitudeMoon(jce)
  ]);
  const epsilon0 = eclipticMeanObliquity(jme);
  const epsilon = eclipticTrueObliquity(nutation.delEpsilon, epsilon0);
  const delTau = aberrationCorrection(r);
  const lamda = apparentSunLongitude(theta, nutation.delPsi, delTau);
  const nu = greenwichSiderealTime(greenwichMeanSiderealTime(jd, jc), nutation.delPsi, epsilon);
  return {
    alpha: geocentricRightAscension(lamda, epsilon, beta),
    delta: geocentricDeclination(beta, epsilon, lamda),
    nu
  };
}
function spaCalculate(spa) {
  const result = validateInputs(spa);
  if (result !== 0) return result;
  spa.jd = julianDay(spa.year, spa.month, spa.day, spa.hour, spa.minute, spa.second, spa.deltaUt1, spa.timezone);
  calculateGeocentricSunRaAndDec(spa);
  spa.h = observerHourAngle(spa.nu, spa.longitude, spa.alpha);
  spa.xi = sunEquatorialHorizontalParallax(spa.r);
  const parallax = rightAscensionParallaxAndTopocentricDec(spa.latitude, spa.elevation, spa.xi, spa.h, spa.delta);
  spa.delAlpha = parallax.deltaAlpha;
  spa.deltaPrime = parallax.deltaPrime;
  spa.alphaPrime = topocentricRightAscension(spa.alpha, spa.delAlpha);
  spa.hPrime = topocentricLocalHourAngle(spa.h, spa.delAlpha);
  spa.e0 = topocentricElevationAngle(spa.latitude, spa.deltaPrime, spa.hPrime);
  spa.delE = atmosphericRefractionCorrection(spa.pressure, spa.temperature, spa.atmosphericRefraction, spa.e0);
  spa.e = topocentricElevationAngleCorrected(spa.e0, spa.delE);
  spa.zenith = topocentricZenithAngle(spa.e);
  spa.azimuthAstro = topocentricAzimuthAngleAstro(spa.hPrime, spa.latitude, spa.deltaPrime);
  spa.azimuth = topocentricAzimuthAngle(spa.azimuthAstro);
  if (spa.function === 1 || spa.function === 3) spa.incidence = surfaceIncidenceAngle(spa.zenith, spa.azimuthAstro, spa.azimuthRotation, spa.slope);
  if (spa.function === 2 || spa.function === 3) {
    const rts = calculateEotAndSunRiseTransitSet(spa, calculateRaDecForJd);
    spa.sunrise = rts.sunrise;
    spa.suntransit = rts.suntransit;
    spa.sunset = rts.sunset;
    spa.srha = rts.srha;
    spa.ssha = rts.ssha;
    spa.sta = rts.sta;
    spa.eot = rts.eot;
  }
  return 0;
}
function initSpaFromDate(date, latitude, longitude, options = {}) {
  const spa = createSpaData();
  const dateTime = resolveDateTimeComponents(date, options.timezone, options.timezoneId);
  spa.year = dateTime.year;
  spa.month = dateTime.month;
  spa.day = dateTime.day;
  spa.hour = dateTime.hour;
  spa.minute = dateTime.minute;
  spa.second = dateTime.second;
  spa.timezone = dateTime.timezone;
  spa.timezoneId = options.timezoneId ?? "";
  spa.latitude = latitude;
  spa.longitude = longitude;
  spa.elevation = options.elevation ?? 0;
  spa.pressure = options.pressure ?? 1013;
  spa.temperature = options.temperature ?? 15;
  spa.deltaUt1 = options.deltaUt1 ?? 0;
  spa.deltaT = options.deltaT ?? 67;
  spa.slope = options.slope ?? 0;
  spa.azimuthRotation = options.azimuthRotation ?? 0;
  spa.atmosphericRefraction = options.atmosphericRefraction ?? 0.5667;
  spa.function = 3;
  return spa;
}
function isValidSunTime(time) {
  return time !== -99999 && isFinite(time) && time >= 0;
}
function getSunrise(latitude, longitude, date = /* @__PURE__ */ new Date(), options) {
  const spa = initSpaFromDate(date, latitude, longitude, options);
  if (spaCalculate(spa) !== 0 || !isValidSunTime(spa.sunrise)) return null;
  return fractionalHourToDate(spa.year, spa.month, spa.day, spa.sunrise, spa.timezone);
}
function getSunset(latitude, longitude, date = /* @__PURE__ */ new Date(), options) {
  const spa = initSpaFromDate(date, latitude, longitude, options);
  if (spaCalculate(spa) !== 0 || !isValidSunTime(spa.sunset)) return null;
  return fractionalHourToDate(spa.year, spa.month, spa.day, spa.sunset, spa.timezone);
}
function getSolarPosition(latitude, longitude, date = /* @__PURE__ */ new Date(), options) {
  const spa = initSpaFromDate(date, latitude, longitude, options);
  if (spaCalculate(spa) !== 0) return null;
  return {
    zenith: spa.zenith,
    azimuth: spa.azimuth,
    azimuthAstro: spa.azimuthAstro,
    elevation: spa.e,
    rightAscension: spa.alpha,
    declination: spa.delta,
    hourAngle: spa.h
  };
}
var PI, SUN_RADIUS, REFRACTION_CORRECTION, L_SUBCOUNT, B_SUBCOUNT, R_SUBCOUNT, INVALID_VALUE, L_TERMS, B_TERMS, R_TERMS, Y_TERMS, PE_TERMS, timeZoneDateTimeFormatters;
var init_dist = __esm({
  "node_modules/sunrise-sunset-js/dist/index.js"() {
    PI = Math.PI;
    SUN_RADIUS = 0.26667;
    REFRACTION_CORRECTION = 0.5667;
    L_SUBCOUNT = [
      64,
      34,
      20,
      7,
      3,
      1
    ];
    B_SUBCOUNT = [5, 2];
    R_SUBCOUNT = [
      40,
      10,
      6,
      2,
      1
    ];
    INVALID_VALUE = -99999;
    L_TERMS = [
      [
        [
          175347046,
          0,
          0
        ],
        [
          3341656,
          4.6692568,
          6283.07585
        ],
        [
          34894,
          4.6261,
          12566.1517
        ],
        [
          3497,
          2.7441,
          5753.3849
        ],
        [
          3418,
          2.8289,
          3.5231
        ],
        [
          3136,
          3.6277,
          77713.7715
        ],
        [
          2676,
          4.4181,
          7860.4194
        ],
        [
          2343,
          6.1352,
          3930.2097
        ],
        [
          1324,
          0.7425,
          11506.7698
        ],
        [
          1273,
          2.0371,
          529.691
        ],
        [
          1199,
          1.1096,
          1577.3435
        ],
        [
          990,
          5.233,
          5884.927
        ],
        [
          902,
          2.045,
          26.298
        ],
        [
          857,
          3.508,
          398.149
        ],
        [
          780,
          1.179,
          5223.694
        ],
        [
          753,
          2.533,
          5507.553
        ],
        [
          505,
          4.583,
          18849.228
        ],
        [
          492,
          4.205,
          775.523
        ],
        [
          357,
          2.92,
          0.067
        ],
        [
          317,
          5.849,
          11790.629
        ],
        [
          284,
          1.899,
          796.298
        ],
        [
          271,
          0.315,
          10977.079
        ],
        [
          243,
          0.345,
          5486.778
        ],
        [
          206,
          4.806,
          2544.314
        ],
        [
          205,
          1.869,
          5573.143
        ],
        [
          202,
          2.458,
          6069.777
        ],
        [
          156,
          0.833,
          213.299
        ],
        [
          132,
          3.411,
          2942.463
        ],
        [
          126,
          1.083,
          20.775
        ],
        [
          115,
          0.645,
          0.98
        ],
        [
          103,
          0.636,
          4694.003
        ],
        [
          102,
          0.976,
          15720.839
        ],
        [
          102,
          4.267,
          7.114
        ],
        [
          99,
          6.21,
          2146.17
        ],
        [
          98,
          0.68,
          155.42
        ],
        [
          86,
          5.98,
          161000.69
        ],
        [
          85,
          1.3,
          6275.96
        ],
        [
          85,
          3.67,
          71430.7
        ],
        [
          80,
          1.81,
          17260.15
        ],
        [
          79,
          3.04,
          12036.46
        ],
        [
          75,
          1.76,
          5088.63
        ],
        [
          74,
          3.5,
          3154.69
        ],
        [
          74,
          4.68,
          801.82
        ],
        [
          70,
          0.83,
          9437.76
        ],
        [
          62,
          3.98,
          8827.39
        ],
        [
          61,
          1.82,
          7084.9
        ],
        [
          57,
          2.78,
          6286.6
        ],
        [
          56,
          4.39,
          14143.5
        ],
        [
          56,
          3.47,
          6279.55
        ],
        [
          52,
          0.19,
          12139.55
        ],
        [
          52,
          1.33,
          1748.02
        ],
        [
          51,
          0.28,
          5856.48
        ],
        [
          49,
          0.49,
          1194.45
        ],
        [
          41,
          5.37,
          8429.24
        ],
        [
          41,
          2.4,
          19651.05
        ],
        [
          39,
          6.17,
          10447.39
        ],
        [
          37,
          6.04,
          10213.29
        ],
        [
          37,
          2.57,
          1059.38
        ],
        [
          36,
          1.71,
          2352.87
        ],
        [
          36,
          1.78,
          6812.77
        ],
        [
          33,
          0.59,
          17789.85
        ],
        [
          30,
          0.44,
          83996.85
        ],
        [
          30,
          2.74,
          1349.87
        ],
        [
          25,
          3.16,
          4690.48
        ]
      ],
      [
        [
          628331966747,
          0,
          0
        ],
        [
          206059,
          2.678235,
          6283.07585
        ],
        [
          4303,
          2.6351,
          12566.1517
        ],
        [
          425,
          1.59,
          3.523
        ],
        [
          119,
          5.796,
          26.298
        ],
        [
          109,
          2.966,
          1577.344
        ],
        [
          93,
          2.59,
          18849.23
        ],
        [
          72,
          1.14,
          529.69
        ],
        [
          68,
          1.87,
          398.15
        ],
        [
          67,
          4.41,
          5507.55
        ],
        [
          59,
          2.89,
          5223.69
        ],
        [
          56,
          2.17,
          155.42
        ],
        [
          45,
          0.4,
          796.3
        ],
        [
          36,
          0.47,
          775.52
        ],
        [
          29,
          2.65,
          7.11
        ],
        [
          21,
          5.34,
          0.98
        ],
        [
          19,
          1.85,
          5486.78
        ],
        [
          19,
          4.97,
          213.3
        ],
        [
          17,
          2.99,
          6275.96
        ],
        [
          16,
          0.03,
          2544.31
        ],
        [
          16,
          1.43,
          2146.17
        ],
        [
          15,
          1.21,
          10977.08
        ],
        [
          12,
          2.83,
          1748.02
        ],
        [
          12,
          3.26,
          5088.63
        ],
        [
          12,
          5.27,
          1194.45
        ],
        [
          12,
          2.08,
          4694
        ],
        [
          11,
          0.77,
          553.57
        ],
        [
          10,
          1.3,
          6286.6
        ],
        [
          10,
          4.24,
          1349.87
        ],
        [
          9,
          2.7,
          242.73
        ],
        [
          9,
          5.64,
          951.72
        ],
        [
          8,
          5.3,
          2352.87
        ],
        [
          6,
          2.65,
          9437.76
        ],
        [
          6,
          4.67,
          4690.48
        ]
      ],
      [
        [
          52919,
          0,
          0
        ],
        [
          8720,
          1.0721,
          6283.0758
        ],
        [
          309,
          0.867,
          12566.152
        ],
        [
          27,
          0.05,
          3.52
        ],
        [
          16,
          5.19,
          26.3
        ],
        [
          16,
          3.68,
          155.42
        ],
        [
          10,
          0.76,
          18849.23
        ],
        [
          9,
          2.06,
          77713.77
        ],
        [
          7,
          0.83,
          775.52
        ],
        [
          5,
          4.66,
          1577.34
        ],
        [
          4,
          1.03,
          7.11
        ],
        [
          4,
          3.44,
          5573.14
        ],
        [
          3,
          5.14,
          796.3
        ],
        [
          3,
          6.05,
          5507.55
        ],
        [
          3,
          1.19,
          242.73
        ],
        [
          3,
          6.12,
          529.69
        ],
        [
          3,
          0.31,
          398.15
        ],
        [
          3,
          2.28,
          553.57
        ],
        [
          2,
          4.38,
          5223.69
        ],
        [
          2,
          3.75,
          0.98
        ]
      ],
      [
        [
          289,
          5.844,
          6283.076
        ],
        [
          35,
          0,
          0
        ],
        [
          17,
          5.49,
          12566.15
        ],
        [
          3,
          5.2,
          155.42
        ],
        [
          1,
          4.72,
          3.52
        ],
        [
          1,
          5.3,
          18849.23
        ],
        [
          1,
          5.97,
          242.73
        ]
      ],
      [
        [
          114,
          3.142,
          0
        ],
        [
          8,
          4.13,
          6283.08
        ],
        [
          1,
          3.84,
          12566.15
        ]
      ],
      [[
        1,
        3.14,
        0
      ]]
    ];
    B_TERMS = [[
      [
        280,
        3.199,
        84334.662
      ],
      [
        102,
        5.422,
        5507.553
      ],
      [
        80,
        3.88,
        5223.69
      ],
      [
        44,
        3.7,
        2352.87
      ],
      [
        32,
        4,
        1577.34
      ]
    ], [[
      9,
      3.9,
      5507.55
    ], [
      6,
      1.73,
      5223.69
    ]]];
    R_TERMS = [
      [
        [
          100013989,
          0,
          0
        ],
        [
          1670700,
          3.0984635,
          6283.07585
        ],
        [
          13956,
          3.05525,
          12566.1517
        ],
        [
          3084,
          5.1985,
          77713.7715
        ],
        [
          1628,
          1.1739,
          5753.3849
        ],
        [
          1576,
          2.8469,
          7860.4194
        ],
        [
          925,
          5.453,
          11506.77
        ],
        [
          542,
          4.564,
          3930.21
        ],
        [
          472,
          3.661,
          5884.927
        ],
        [
          346,
          0.964,
          5507.553
        ],
        [
          329,
          5.9,
          5223.694
        ],
        [
          307,
          0.299,
          5573.143
        ],
        [
          243,
          4.273,
          11790.629
        ],
        [
          212,
          5.847,
          1577.344
        ],
        [
          186,
          5.022,
          10977.079
        ],
        [
          175,
          3.012,
          18849.228
        ],
        [
          110,
          5.055,
          5486.778
        ],
        [
          98,
          0.89,
          6069.78
        ],
        [
          86,
          5.69,
          15720.84
        ],
        [
          86,
          1.27,
          161000.69
        ],
        [
          65,
          0.27,
          17260.15
        ],
        [
          63,
          0.92,
          529.69
        ],
        [
          57,
          2.01,
          83996.85
        ],
        [
          56,
          5.24,
          71430.7
        ],
        [
          49,
          3.25,
          2544.31
        ],
        [
          47,
          2.58,
          775.52
        ],
        [
          45,
          5.54,
          9437.76
        ],
        [
          43,
          6.01,
          6275.96
        ],
        [
          39,
          5.36,
          4694
        ],
        [
          38,
          2.39,
          8827.39
        ],
        [
          37,
          0.83,
          19651.05
        ],
        [
          37,
          4.9,
          12139.55
        ],
        [
          36,
          1.67,
          12036.46
        ],
        [
          35,
          1.84,
          2942.46
        ],
        [
          33,
          0.24,
          7084.9
        ],
        [
          32,
          0.18,
          5088.63
        ],
        [
          32,
          1.78,
          398.15
        ],
        [
          28,
          1.21,
          6286.6
        ],
        [
          28,
          1.9,
          6279.55
        ],
        [
          26,
          4.59,
          10447.39
        ]
      ],
      [
        [
          103019,
          1.10749,
          6283.07585
        ],
        [
          1721,
          1.0644,
          12566.1517
        ],
        [
          702,
          3.142,
          0
        ],
        [
          32,
          1.02,
          18849.23
        ],
        [
          31,
          2.84,
          5507.55
        ],
        [
          25,
          1.32,
          5223.69
        ],
        [
          18,
          1.42,
          1577.34
        ],
        [
          10,
          5.91,
          10977.08
        ],
        [
          9,
          1.42,
          6275.96
        ],
        [
          9,
          0.27,
          5486.78
        ]
      ],
      [
        [
          4359,
          5.7846,
          6283.0758
        ],
        [
          124,
          5.579,
          12566.152
        ],
        [
          12,
          3.14,
          0
        ],
        [
          9,
          3.63,
          77713.77
        ],
        [
          6,
          1.87,
          5573.14
        ],
        [
          3,
          5.47,
          18849.23
        ]
      ],
      [[
        145,
        4.273,
        6283.076
      ], [
        7,
        3.92,
        12566.15
      ]],
      [[
        4,
        2.56,
        6283.08
      ]]
    ];
    Y_TERMS = [
      [
        0,
        0,
        0,
        0,
        1
      ],
      [
        -2,
        0,
        0,
        2,
        2
      ],
      [
        0,
        0,
        0,
        2,
        2
      ],
      [
        0,
        0,
        0,
        0,
        2
      ],
      [
        0,
        1,
        0,
        0,
        0
      ],
      [
        0,
        0,
        1,
        0,
        0
      ],
      [
        -2,
        1,
        0,
        2,
        2
      ],
      [
        0,
        0,
        0,
        2,
        1
      ],
      [
        0,
        0,
        1,
        2,
        2
      ],
      [
        -2,
        -1,
        0,
        2,
        2
      ],
      [
        -2,
        0,
        1,
        0,
        0
      ],
      [
        -2,
        0,
        0,
        2,
        1
      ],
      [
        0,
        0,
        -1,
        2,
        2
      ],
      [
        2,
        0,
        0,
        0,
        0
      ],
      [
        0,
        0,
        1,
        0,
        1
      ],
      [
        2,
        0,
        -1,
        2,
        2
      ],
      [
        0,
        0,
        -1,
        0,
        1
      ],
      [
        0,
        0,
        1,
        2,
        1
      ],
      [
        -2,
        0,
        2,
        0,
        0
      ],
      [
        0,
        0,
        -2,
        2,
        1
      ],
      [
        2,
        0,
        0,
        2,
        2
      ],
      [
        0,
        0,
        2,
        2,
        2
      ],
      [
        0,
        0,
        2,
        0,
        0
      ],
      [
        -2,
        0,
        1,
        2,
        2
      ],
      [
        0,
        0,
        0,
        2,
        0
      ],
      [
        -2,
        0,
        0,
        2,
        0
      ],
      [
        0,
        0,
        -1,
        2,
        1
      ],
      [
        0,
        2,
        0,
        0,
        0
      ],
      [
        2,
        0,
        -1,
        0,
        1
      ],
      [
        -2,
        2,
        0,
        2,
        2
      ],
      [
        0,
        1,
        0,
        0,
        1
      ],
      [
        -2,
        0,
        1,
        0,
        1
      ],
      [
        0,
        -1,
        0,
        0,
        1
      ],
      [
        0,
        0,
        2,
        -2,
        0
      ],
      [
        2,
        0,
        -1,
        2,
        1
      ],
      [
        2,
        0,
        1,
        2,
        2
      ],
      [
        0,
        1,
        0,
        2,
        2
      ],
      [
        -2,
        1,
        1,
        0,
        0
      ],
      [
        0,
        -1,
        0,
        2,
        2
      ],
      [
        2,
        0,
        0,
        2,
        1
      ],
      [
        2,
        0,
        1,
        0,
        0
      ],
      [
        -2,
        0,
        2,
        2,
        2
      ],
      [
        -2,
        0,
        1,
        2,
        1
      ],
      [
        2,
        0,
        -2,
        0,
        1
      ],
      [
        2,
        0,
        0,
        0,
        1
      ],
      [
        0,
        -1,
        1,
        0,
        0
      ],
      [
        -2,
        -1,
        0,
        2,
        1
      ],
      [
        -2,
        0,
        0,
        0,
        1
      ],
      [
        0,
        0,
        2,
        2,
        1
      ],
      [
        -2,
        0,
        2,
        0,
        1
      ],
      [
        -2,
        1,
        0,
        2,
        1
      ],
      [
        0,
        0,
        1,
        -2,
        0
      ],
      [
        -1,
        0,
        1,
        0,
        0
      ],
      [
        -2,
        1,
        0,
        0,
        0
      ],
      [
        1,
        0,
        0,
        0,
        0
      ],
      [
        0,
        0,
        1,
        2,
        0
      ],
      [
        0,
        0,
        -2,
        2,
        2
      ],
      [
        -1,
        -1,
        1,
        0,
        0
      ],
      [
        0,
        1,
        1,
        0,
        0
      ],
      [
        0,
        -1,
        1,
        2,
        2
      ],
      [
        2,
        -1,
        -1,
        2,
        2
      ],
      [
        0,
        0,
        3,
        2,
        2
      ],
      [
        2,
        -1,
        0,
        2,
        2
      ]
    ];
    PE_TERMS = [
      [
        -171996,
        -174.2,
        92025,
        8.9
      ],
      [
        -13187,
        -1.6,
        5736,
        -3.1
      ],
      [
        -2274,
        -0.2,
        977,
        -0.5
      ],
      [
        2062,
        0.2,
        -895,
        0.5
      ],
      [
        1426,
        -3.4,
        54,
        -0.1
      ],
      [
        712,
        0.1,
        -7,
        0
      ],
      [
        -517,
        1.2,
        224,
        -0.6
      ],
      [
        -386,
        -0.4,
        200,
        0
      ],
      [
        -301,
        0,
        129,
        -0.1
      ],
      [
        217,
        -0.5,
        -95,
        0.3
      ],
      [
        -158,
        0,
        0,
        0
      ],
      [
        129,
        0.1,
        -70,
        0
      ],
      [
        123,
        0,
        -53,
        0
      ],
      [
        63,
        0,
        0,
        0
      ],
      [
        63,
        0.1,
        -33,
        0
      ],
      [
        -59,
        0,
        26,
        0
      ],
      [
        -58,
        -0.1,
        32,
        0
      ],
      [
        -51,
        0,
        27,
        0
      ],
      [
        48,
        0,
        0,
        0
      ],
      [
        46,
        0,
        -24,
        0
      ],
      [
        -38,
        0,
        16,
        0
      ],
      [
        -31,
        0,
        13,
        0
      ],
      [
        29,
        0,
        0,
        0
      ],
      [
        29,
        0,
        -12,
        0
      ],
      [
        26,
        0,
        0,
        0
      ],
      [
        -22,
        0,
        0,
        0
      ],
      [
        21,
        0,
        -10,
        0
      ],
      [
        17,
        -0.1,
        0,
        0
      ],
      [
        16,
        0,
        -8,
        0
      ],
      [
        -16,
        0.1,
        7,
        0
      ],
      [
        -15,
        0,
        9,
        0
      ],
      [
        -13,
        0,
        7,
        0
      ],
      [
        -12,
        0,
        6,
        0
      ],
      [
        11,
        0,
        0,
        0
      ],
      [
        -10,
        0,
        5,
        0
      ],
      [
        -8,
        0,
        3,
        0
      ],
      [
        7,
        0,
        -3,
        0
      ],
      [
        -7,
        0,
        0,
        0
      ],
      [
        -7,
        0,
        3,
        0
      ],
      [
        -7,
        0,
        3,
        0
      ],
      [
        6,
        0,
        0,
        0
      ],
      [
        6,
        0,
        -3,
        0
      ],
      [
        6,
        0,
        -3,
        0
      ],
      [
        -6,
        0,
        3,
        0
      ],
      [
        -6,
        0,
        3,
        0
      ],
      [
        5,
        0,
        0,
        0
      ],
      [
        -5,
        0,
        3,
        0
      ],
      [
        -5,
        0,
        3,
        0
      ],
      [
        -5,
        0,
        3,
        0
      ],
      [
        4,
        0,
        0,
        0
      ],
      [
        4,
        0,
        0,
        0
      ],
      [
        4,
        0,
        0,
        0
      ],
      [
        -4,
        0,
        0,
        0
      ],
      [
        -4,
        0,
        0,
        0
      ],
      [
        -4,
        0,
        0,
        0
      ],
      [
        3,
        0,
        0,
        0
      ],
      [
        -3,
        0,
        0,
        0
      ],
      [
        -3,
        0,
        0,
        0
      ],
      [
        -3,
        0,
        0,
        0
      ],
      [
        -3,
        0,
        0,
        0
      ],
      [
        -3,
        0,
        0,
        0
      ],
      [
        -3,
        0,
        0,
        0
      ],
      [
        -3,
        0,
        0,
        0
      ]
    ];
    timeZoneDateTimeFormatters = /* @__PURE__ */ new Map();
  }
});

// src/solar.js
function validateCoordinates(latitude, longitude) {
  if (typeof latitude !== "number" || typeof longitude !== "number" || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new TypeError(
      "Latitude and longitude must be finite numbers"
    );
  }
  if (latitude < -90 || latitude > 90) {
    throw new RangeError(
      "Latitude must be between -90 and 90 degrees"
    );
  }
  if (longitude < -180 || longitude > 180) {
    throw new RangeError(
      "Longitude must be between -180 and 180 degrees"
    );
  }
}
function validateDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("Date must be a valid Date object");
  }
}
function getSolarTimes(latitude, longitude, date = /* @__PURE__ */ new Date()) {
  validateCoordinates(latitude, longitude);
  validateDate(date);
  return {
    sunrise: getSunrise(latitude, longitude, date),
    sunset: getSunset(latitude, longitude, date)
  };
}
function isDaylight(latitude, longitude, date = /* @__PURE__ */ new Date()) {
  validateCoordinates(latitude, longitude);
  validateDate(date);
  const { elevation } = getSolarPosition(
    latitude,
    longitude,
    date
  );
  return elevation >= 0;
}
var init_solar = __esm({
  "src/solar.js"() {
    init_dist();
  }
});

// src/magicmirror-current.js
function buildCurrentWeatherObject(observation, forecastTimeline, latitude, longitude) {
  if (observation === null || typeof observation !== "object" || Array.isArray(observation)) {
    throw new TypeError("Observation must be an object");
  }
  if (typeof observation.time !== "string") {
    throw new TypeError(
      "Observation must contain a valid timestamp"
    );
  }
  const observationDate = new Date(observation.time);
  if (Number.isNaN(observationDate.getTime())) {
    throw new TypeError(
      "Observation must contain a valid timestamp"
    );
  }
  const requiredNumericFields = [
    "temperature",
    "humidity",
    "windDirection",
    "windSpeed"
  ];
  for (const field of requiredNumericFields) {
    if (typeof observation[field] !== "number" || !Number.isFinite(observation[field])) {
      return null;
    }
  }
  const weatherSymbol = findNearestWeatherSymbol(
    observation.time,
    forecastTimeline
  );
  if (weatherSymbol === null) {
    return null;
  }
  const daylight = isDaylight(
    latitude,
    longitude,
    observationDate
  );
  const weatherType = mapFmiWeatherSymbol(
    weatherSymbol,
    daylight
  );
  if (weatherType === null) {
    return null;
  }
  const { sunrise, sunset } = getSolarTimes(
    latitude,
    longitude,
    observationDate
  );
  return {
    humidity: observation.humidity,
    sunrise,
    sunset,
    temperature: observation.temperature,
    weatherType,
    windFromDirection: observation.windDirection,
    windSpeed: observation.windSpeed
  };
}
var init_magicmirror_current = __esm({
  "src/magicmirror-current.js"() {
    init_magicmirror_weather();
    init_solar();
  }
});

// src/timezone.js
function validateTimeZone(timeZone) {
  if (typeof timeZone !== "string" || timeZone.trim() === "") {
    throw new TypeError(
      "Time zone must be a non-empty string"
    );
  }
  new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone.trim()
  });
}
function getLocalDateTimeParts(timestamp, timeZone) {
  validateTimeZone(timeZone);
  const date = timestamp instanceof Date ? new Date(timestamp.getTime()) : new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError("Timestamp must be a valid date");
  }
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone.trim(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  const second = Number(parts.second);
  return {
    dateKey: [
      parts.year,
      parts.month,
      parts.day
    ].join("-"),
    year,
    month,
    day,
    hour,
    minute,
    second
  };
}
var init_timezone = __esm({
  "src/timezone.js"() {
  }
});

// src/magicmirror-forecast.js
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function findRepresentativeWeather(entries, timeZone) {
  let bestCandidate = null;
  for (const entry of entries) {
    if (!isFiniteNumber(entry.weatherSymbol)) {
      continue;
    }
    const weatherType = mapFmiWeatherSymbol(
      entry.weatherSymbol,
      true
    );
    if (weatherType === null) {
      continue;
    }
    const local = getLocalDateTimeParts(
      entry.time,
      timeZone
    );
    const minutesFromNoon = Math.abs(
      local.hour * 60 + local.minute - 12 * 60
    );
    const timestamp = new Date(entry.time).getTime();
    if (bestCandidate === null || minutesFromNoon < bestCandidate.minutesFromNoon || minutesFromNoon === bestCandidate.minutesFromNoon && timestamp < bestCandidate.timestamp) {
      bestCandidate = {
        entry,
        weatherType,
        minutesFromNoon,
        timestamp
      };
    }
  }
  if (bestCandidate === null) {
    return null;
  }
  return {
    entry: bestCandidate.entry,
    weatherType: bestCandidate.weatherType
  };
}
function buildDailyForecastObjects(forecastTimeline, timeZone) {
  if (!Array.isArray(forecastTimeline)) {
    throw new TypeError(
      "Forecast timeline must be an array"
    );
  }
  getLocalDateTimeParts(
    /* @__PURE__ */ new Date(0),
    timeZone
  );
  const days = /* @__PURE__ */ new Map();
  for (const entry of forecastTimeline) {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry) || typeof entry.time !== "string") {
      continue;
    }
    const timestamp = new Date(entry.time);
    if (Number.isNaN(timestamp.getTime())) {
      continue;
    }
    const local = getLocalDateTimeParts(
      timestamp,
      timeZone
    );
    if (!days.has(local.dateKey)) {
      days.set(local.dateKey, []);
    }
    days.get(local.dateKey).push(entry);
  }
  const forecast = [];
  for (const entries of days.values()) {
    const temperatures = entries.map((entry) => entry.temperature).filter(isFiniteNumber);
    const precipitationValues = entries.map((entry) => entry.precipitation).filter(
      (value) => isFiniteNumber(value) && value >= 0
    );
    if (temperatures.length === 0 || precipitationValues.length === 0) {
      continue;
    }
    const representativeWeather = findRepresentativeWeather(
      entries,
      timeZone
    );
    if (representativeWeather === null) {
      continue;
    }
    const precipitationAmount = Number(
      precipitationValues.reduce(
        (sum, value) => sum + value,
        0
      ).toPrecision(12)
    );
    forecast.push({
      /*
       * The representative timestamp is nearest to local noon, which
       * keeps the Date safely inside the intended local calendar day.
       */
      date: new Date(
        representativeWeather.entry.time
      ),
      maxTemperature: Math.max(...temperatures),
      minTemperature: Math.min(...temperatures),
      precipitationAmount,
      weatherType: representativeWeather.weatherType
    });
  }
  return forecast;
}
var init_magicmirror_forecast = __esm({
  "src/magicmirror-forecast.js"() {
    init_magicmirror_weather();
    init_timezone();
  }
});

// src/magicmirror-service.js
function buildMagicMirrorWeatherData(observation, forecastTimeline, latitude, longitude, timeZone) {
  const current = observation === null ? null : buildCurrentWeatherObject(
    observation,
    forecastTimeline,
    latitude,
    longitude
  );
  const forecast = buildDailyForecastObjects(
    forecastTimeline,
    timeZone
  );
  return {
    current,
    forecast
  };
}
async function getMagicMirrorWeather(config, fetchImpl = fetch) {
  if (config === null || typeof config !== "object" || Array.isArray(config)) {
    throw new TypeError(
      "MagicMirror weather configuration must be an object"
    );
  }
  const {
    place,
    latitude,
    longitude,
    timeZone,
    type
  } = config;
  if (type === "forecast" || type === "daily") {
    const forecastTimeline2 = await getForecast(
      place,
      fetchImpl
    );
    return buildMagicMirrorWeatherData(
      null,
      forecastTimeline2,
      latitude,
      longitude,
      timeZone
    );
  }
  const [
    observation,
    forecastTimeline
  ] = await Promise.all([
    getCurrentWeather(
      place,
      fetchImpl
    ),
    getForecast(
      place,
      fetchImpl
    )
  ]);
  return buildMagicMirrorWeatherData(
    observation,
    forecastTimeline,
    latitude,
    longitude,
    timeZone
  );
}
var init_magicmirror_service = __esm({
  "src/magicmirror-service.js"() {
    init_fmi_service();
    init_magicmirror_current();
    init_magicmirror_forecast();
  }
});

// src/magicmirror-provider.js
var magicmirror_provider_exports = {};
__export(magicmirror_provider_exports, {
  MagicMirrorFmiProvider: () => MagicMirrorFmiProvider,
  default: () => magicmirror_provider_default
});
function validateConfig(config) {
  if (config === null || typeof config !== "object" || Array.isArray(config)) {
    return "FMI weather configuration must be an object";
  }
  if (typeof config.location !== "string" || config.location.trim() === "") {
    return "FMI weather provider requires config.location";
  }
  if (typeof config.lat !== "number" || !Number.isFinite(config.lat) || config.lat < -90 || config.lat > 90) {
    return "FMI weather provider requires a valid config.lat";
  }
  if (typeof config.lon !== "number" || !Number.isFinite(config.lon) || config.lon < -180 || config.lon > 180) {
    return "FMI weather provider requires a valid config.lon";
  }
  if (typeof config.timezone !== "string" || config.timezone.trim() === "") {
    return "FMI weather provider requires config.timezone";
  }
  try {
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: config.timezone.trim()
      }
    );
  } catch {
    return "FMI weather provider requires a valid IANA timezone";
  }
  if (![
    "current",
    "forecast",
    "daily"
  ].includes(config.type)) {
    return "FMI weather provider supports only current, forecast and daily types";
  }
  return null;
}
var DEFAULT_UPDATE_INTERVAL, DEFAULT_MAX_FORECAST_DAYS, MagicMirrorFmiProvider, magicmirror_provider_default;
var init_magicmirror_provider = __esm({
  "src/magicmirror-provider.js"() {
    init_magicmirror_service();
    DEFAULT_UPDATE_INTERVAL = 6e5;
    DEFAULT_MAX_FORECAST_DAYS = 5;
    MagicMirrorFmiProvider = class {
      /**
       * Create the provider.
       *
       * Optional dependencies are injectable so lifecycle behaviour can be
       * tested without real network requests or real timers.
       *
       * @param {object} config MagicMirror weather module configuration.
       * @param {Function} weatherService FMI MagicMirror weather service.
       * @param {object} timerApi Timer implementation.
       */
      constructor(config, weatherService = getMagicMirrorWeather, timerApi = {
        setTimeout,
        clearTimeout
      }) {
        this.config = config;
        this.weatherService = weatherService;
        this.timerApi = timerApi;
        this.locationName = typeof config?.location === "string" ? config.location : null;
        this.onDataCallback = null;
        this.onErrorCallback = null;
        this.timer = null;
        this.initialized = false;
        this.stopped = true;
        this.updateInProgress = false;
      }
      /**
       * Store callbacks supplied by the MagicMirror weather node helper.
       *
       * @param {Function} onData Weather data callback.
       * @param {Function} onError Provider error callback.
       */
      setCallbacks(onData, onError) {
        this.onDataCallback = onData;
        this.onErrorCallback = onError;
      }
      /**
       * Validate configuration before starting the provider.
       */
      initialize() {
        const validationError = validateConfig(this.config);
        if (validationError !== null) {
          this.reportError(validationError);
          return;
        }
        this.locationName = this.config.location.trim();
        this.initialized = true;
      }
      /**
       * Start fetching weather data.
       */
      start() {
        if (!this.initialized) {
          return;
        }
        this.stopped = false;
        const initialLoadDelay = Number.isFinite(this.config.initialLoadDelay) && this.config.initialLoadDelay > 0 ? this.config.initialLoadDelay : 0;
        if (initialLoadDelay > 0) {
          this.timer = this.timerApi.setTimeout(
            () => {
              void this.updateWeather();
            },
            initialLoadDelay
          );
          return;
        }
        void this.updateWeather();
      }
      /**
       * Stop periodic updates and clear the active timer.
       */
      stop() {
        this.stopped = true;
        if (this.timer !== null) {
          this.timerApi.clearTimeout(this.timer);
          this.timer = null;
        }
      }
      /**
       * Fetch one weather update and deliver it to MagicMirror.
       *
       * @returns {Promise<void>}
       */
      async updateWeather() {
        if (this.stopped || this.updateInProgress) {
          return;
        }
        this.updateInProgress = true;
        try {
          const weather = await this.weatherService({
            place: this.config.location.trim(),
            latitude: this.config.lat,
            longitude: this.config.lon,
            timeZone: this.config.timezone.trim(),
            type: this.config.type
          });
          if (this.stopped) {
            return;
          }
          const data = this.selectWeatherData(weather);
          if (typeof this.onDataCallback === "function") {
            this.onDataCallback(data);
          }
        } catch (error) {
          if (!this.stopped) {
            this.reportError(
              error instanceof Error ? error.message : String(error)
            );
          }
        } finally {
          this.updateInProgress = false;
          if (!this.stopped) {
            this.scheduleNextUpdate();
          }
        }
      }
      /**
       * Select current or forecast data for the configured MagicMirror type.
       *
       * @param {{current: object|null, forecast: object[]}} weather
       * Combined MagicMirror weather data.
       * @returns {object|object[]} Data expected by the weather module.
       */
      selectWeatherData(weather) {
        if (this.config.type === "current") {
          if (weather.current === null) {
            throw new Error(
              "FMI current weather data is unavailable"
            );
          }
          return weather.current;
        }
        if (!Array.isArray(weather.forecast) || weather.forecast.length === 0) {
          throw new Error(
            "FMI forecast data is unavailable"
          );
        }
        const maxDays = Number.isInteger(this.config.maxNumberOfDays) && this.config.maxNumberOfDays > 0 ? this.config.maxNumberOfDays : DEFAULT_MAX_FORECAST_DAYS;
        return weather.forecast.slice(
          0,
          maxDays
        );
      }
      /**
       * Schedule the next provider update.
       */
      scheduleNextUpdate() {
        const updateInterval = Number.isFinite(this.config.updateInterval) && this.config.updateInterval >= 1e3 ? this.config.updateInterval : DEFAULT_UPDATE_INTERVAL;
        this.timer = this.timerApi.setTimeout(
          () => {
            void this.updateWeather();
          },
          updateInterval
        );
      }
      /**
       * Report an error through the MagicMirror provider callback.
       *
       * @param {string} message Human-readable error message.
       */
      reportError(message) {
        if (typeof this.onErrorCallback !== "function") {
          return;
        }
        this.onErrorCallback({
          message,
          translationKey: "MODULE_ERROR_UNSPECIFIED"
        });
      }
    };
    magicmirror_provider_default = MagicMirrorFmiProvider;
  }
});

// src/magicmirror-entry.cjs
var {
  MagicMirrorFmiProvider: MagicMirrorFmiProvider2
} = (init_magicmirror_provider(), __toCommonJS(magicmirror_provider_exports));
module.exports = MagicMirrorFmiProvider2;
