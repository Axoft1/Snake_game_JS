"use strict";

/**
 * Объект DTO с настройками игры по умолчанию, которые можно будет поменять при инициализации игры.
 * @property {int} rowsCount Количество строк.
 * @property {int} colsCount Количество колонок.
 * @property {int} speed Скорость змейки.
 * @property {int} winLength Длина змейки для победы.
 */

 const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
  };

  /**
 * Объект конфига игры, содержащий методы получения настроек и проверки этих настроек.
 * @property {settings} settings Настройки игры.
 */
   const config = {
    settings,
  
    /**
     * Инициализация настроек игры.
     * @param {Object} userSettings Объект с пользовательскими настройками игры.
     */
    init(userSettings) {
      // Записываем переданные настройки в те, которые будут использоваться.
      Object.assign(this.settings, userSettings);
    },
  
    /**
     * @returns {int} Отдает количество строк в игре.
     */
    getRowsCount() {
      return this.settings.rowsCount;
    },
  
    /**
     * @returns {int} Отдает количество колонок в игре.
     */
    getColsCount() {
      return this.settings.colsCount;
    },
  
    /**
     * @returns {int} Отдает скорость змейки в игре.
     */
    getSpeed() {
      return this.settings.speed;
    },
  
    /**
     * @returns {int} Отдает количество еды, которое надо съесть для победы.
     */
    getWinFoodCount() {
      return this.settings.winFoodCount;
    },
  
    /**
     * Проверка значений настроек игры.
     * @returns {{isValid: boolean, errors: Array}} Результат валидации в виде объекта с ошибками.
     */
    validate() {
      /**
       * Объект DTO с результатами валидации.
       * @property {boolean} isValid true, если настройки валидны, иначе false.
       * @property {string[]} errors массив со всеми ошибками настроек.
       */
      const result = {
        isValid: true,
        errors: [],
      };
  
      if (this.settings.rowsCount < 10 || this.settings.rowsCount > 30) {
        result.isValid = false;
        result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
      }
  
      if (this.settings.colsCount < 10 || this.settings.colsCount > 30) {
        result.isValid = false;
        result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
      }
  
      if (this.settings.speed < 1 || this.settings.speed > 10) {
        result.isValid = false;
        result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
      }
  
      if (this.settings.winFoodCount < 5 || this.settings.winFoodCount > 50) {
        result.isValid = false;
        result.errors.push('Неверные настройки, значение winLength должно быть в диапазоне [5, 50].');
      }
  
      return result;
    },
  };

  /**
 * Объект карты с методами отображения и создания игрового поля.
 * @property {Object} cells Объект содержащий все ячейки игры.
 * @property {Array} usedCells Массив содержащий все занятые ячейки игры.
 */
const map = {
    cells: null,
  usedCells: null,

  /**
   * Метод инициализирует и выводит карту для игры.
   * @param {int} rowsCount Количество строк в карте.
   * @param {int} colsCount Количество колонок в карте.
   */
  init(rowsCount, colsCount) {
    // Контейнер, где будут наши ячейки, первоначально его очистим.
    const table = document.getElementById('game');
    table.innerHTML = "";
    // Объект-хранилище всех клеток пока пустой.
    this.cells = {};
    // Массив со всеми занятыми элементами на карте пока тоже пустой.
    this.usedCells = [];
    // Цикл запустится столько раз, сколько у нас количество строк.
    for (let row = 0; row < rowsCount; row++) {
      // Создаем строку, добавляем ей класс, после добавляем ее в таблицу.
      const tr = document.createElement('tr');
      tr.classList.add('row');
      table.appendChild(tr);
      // Цикл запустится столько раз, сколько у нас количество колонок.
      for (let col = 0; col < colsCount; col++) {
        // Создаем ячейку, добавляем ячейке класс cell.
        const td = document.createElement('td');
        td.classList.add('cell');
        // Записываем в объект всех ячеек новую ячейку.
        this.cells[`x${col.toString()}_y${row.toString()}`] = td;
        // Добавляем ячейку в строку.
        tr.appendChild(td);
      }
    }
  },

  /**
   * Отображает все объекты на карте.
   * @param {{x: int, y: int}[]} snakePointsArray Массив с точками змейки.
   * @param {{x: int, y: int}} foodPoint Точка еды.
   * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach|Array.prototype.forEach()}
   */
  render(snakePointsArray, foodPoint) {
    // Чистим карту от предыдущего рендера, всем занятым ячейкам оставляем только класс cell.
    for (const cell of this.usedCells) {
      cell.className = 'cell';
    }
    // Очищаем массив с занятыми ячейками, при отображении сейчас его соберем заново.
    this.usedCells = [];
    // Отображаем змейку.
    snakePointsArray.forEach((point, idx) => {
      // Получаем элемент ячейки змейки по точке point.
      const snakeCell = this.cells[`x${point.x}_y${point.y}`];
      // Если первый элемент массива, значит это голова, иначе тело.
      snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
      // Добавляем элемент ячейки змейки в массив занятых точек на карте.
      this.usedCells.push(snakeCell);
    });
    // Получаем элемент ячейки с едой по точке foodPoint.
    const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
    // Отображаем еду.
    foodCell.classList.add('food');
    // Добавляем элемент ячейки еды в массив занятых точек на карте.
    this.usedCells.push(foodCell);
  },
}

/**
 * Объект змейки.
 * @property {{x: int, y: int}[]} body Массив с точками тела змейки.
 * @property {string} direction Направление, куда пользователь направил змейку.
 * @property {string} lastStepDirection Направление, куда сходила змейка прошлый раз.
 * @property {int} maxX Максимальная позиция змейки на карте по оси X.
 * @property {int} maxY Максимальная позиция змейки на карте по оси Y.
 */
 const snake = {
    body: null,
    direction: null,
    lastStepDirection: null,
    maxX: null,
    maxY: null,
  
    /**
     * Инициализирует змейку, откуда она будет начинать и ее направление.
     * @param {{x: int, y: int}[]} startBody Начальная позиция змейки.
     * @param {string} direction Начальное направление игрока.
     * @param {int} maxX Максимальная позиция змейки по оси X.
     * @param {int} maxY Максимальная позиция змейки по оси Y.
     */
    init(startBody, direction, maxX, maxY) {
      this.body = startBody;
      this.direction = direction;
      this.lastStepDirection = direction;
      this.maxX = maxX;
      this.maxY = maxY;
    },
  
    /**
     * Отдает массив со всеми точками змейки.
     * @return {{x: int, y: int}[]};
     */
    getBody() {
      return this.body;
    },
  
    /**
     * Отдает прошлое направление змейки.
     */
    getLastStepDirection() {
      return this.lastStepDirection;
    },
  
    /**
     * Проверяет содержит ли змейка переданную точку.
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.prototype.some()}
     * @param {{x: int, y: int}} point Точка, которую проверяем.
     * @returns {boolean} true, если змейка содержит переданную точку, иначе false.
     */
    isOnPoint(point) {
      return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },
  
    /**
     * Двигает змейку на один шаг.
     */
    makeStep() {
      // Записываем направление движения, которое сейчас произойдет как направление прошлого шага.
      this.lastStepDirection = this.direction;
      // Вставляем следующую точку в начало массива.
      this.body.unshift(this.getNextStepHeadPoint());
      // Удаляем последний лишний элемент.
      this.body.pop();
    },
  
    /**
     * Добавляет в конец тела змейки копию последнего элемента змейки.
     */
    growUp() {
      // Получаем индекс последней точки в массиве точек змейки (последний элемент this.body).
      const lastBodyIdx = this.body.length - 1;
      // Получаем последнюю точку змейки.
      const lastBodyPoint = this.body[lastBodyIdx];
      // Клонируем последнюю точку змейки (делаем копию).
      const lastBodyPointClone = Object.assign({}, lastBodyPoint);
      // Добавляем копию в наш массив this.body.
      this.body.push(lastBodyPointClone);
    },
  
    /**
     * Отдает точку, где будет голова змейки если она сделает шаг.
     * @returns {{x: int, y: int}} Следующая точка куда придет змейка сделав шаг.
     */
    getNextStepHeadPoint() {
      // Получаем в отдельную переменную голову змейки.
      const firstPoint = this.body[0];
      // Возвращаем точку, где окажется голова змейки в зависимости от направления.
      switch (this.direction) {
        case 'up':
          return {x: firstPoint.x, y: firstPoint.y !== 0 ? firstPoint.y - 1 : this.maxY};
        case 'right':
          return {x: firstPoint.x !== this.maxX ? firstPoint.x + 1 : 0, y: firstPoint.y};
        case 'down':
          return {x: firstPoint.x, y: firstPoint.y !== this.maxY ? firstPoint.y + 1 : 0};
        case 'left':
          return {x: firstPoint.x !== 0 ? firstPoint.x - 1 : this.maxX, y: firstPoint.y};
      }
    },
  
    /**
     * Устанавливает направление змейки.
     * @param {string} direction Направление змейки.
     */
    setDirection(direction) {
      this.direction = direction;
    },
 }

 /**
 * Объект еды.
 * @property {int} x Координата X еды.
 * @property {int} y Координата Y еды.
 */
const food = {}

/**
 * Статус игры.
 * @property {string} condition Статус игры.
 */
 const status = {}

 /**
 * Объект счетчика. Подсчитывает очки пользователя.
 * @property {int} count Очки пользователя.
 * @property {HTMLElement} countEl DOM-элемент для вставки числа отображающего количество очков пользователя.
 */
const score = {
    count: null,
    countEl: null,
  
    /**
     * Инициализацирует счетчик.
     */
    init() {
      this.countEl = document.getElementById('score-count');
      this.drop();
    },
  
    /**
     * Инкрементирует счетчик.
     */
    increment() {
      this.count++;
      this.render();
    },
  
    /**
     * Сбрасывает счетчик.
     */
    drop() {
      this.count = 0;
      this.render();
    },
  
    /**
     * Отображает количество очков пользователю.
     */
    render() {
      this.countEl.textContent = this.count;
    }
  };

/**
 * Объект игры.
 * @property {settings} settings Настройки игры.
 * @property {map} map Объект отображения.
 * @property {snake} snake Объект змейки.
 * @property {food} food Объект еды.
 * @property {status} status Статус игры.
 * @property {score} score Счетчик игры.
 * @property {int} tickInterval Номер интервала игры.
 */
 const game = {
    config,
    map,
    snake,
    food,
    status,
    score,
    tickInterval: null,
  
    /**
     * Инициализация игры.
     * @param {object} userSettings Настройки игры, которые можно изменить.
     */
    init(userSettings) {
      // Инициализируем настройки игры.
      this.config.init(userSettings);
      // Получаем результат валидации настроек.
      const validation = this.config.validate();
      // Если настройки игры неверные - сообщаем об ошибках и выходим из метода, игру не запускаем.
      if (!validation.isValid) {
        for (const err of validation.errors) {
          console.error(err);
        }
        return;
      }
      // Инициализируем карту.
      this.map.init(this.config.getRowsCount(), this.config.getColsCount());
      // Инициализируем счетчик.
      this.score.init();
      // Устанавливаем обработчики событий.
      //this.setEventHandlers();
      // Ставим игру в начальное положение.
      //this.reset();
    },

 }

 // При загрузке страницы инициализируем игру.
window.onload = game.init({speed: 5});