<template>
    <div>
    <v-dialog v-model="modalEquipment" persistent max-width="900px" >
      <template v-slot:activator="{ on }" style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;">
        <!-- <v-btn color="primary" dark v-on="on">Выбрать оборудование</v-btn> -->
        <v-btn  style="float:left; margin-right: 10px; margin-top: 15px; width: 250px;" v-on="on" >
            Выбрать оборудование
        </v-btn>
    </template>
      <v-card>
        <v-card-title style="justify-content:center" >
          <span class="headline" >Выбор оборудования</span>
        </v-card-title>
        
          <v-container>
              <v-data-table 
        dense 
        :headers="selectEquipment" 
        :items="selectEquipmentItems" 
        item-key="count"
        class="elevation-1"
        :items-per-page="10"
        fixed-header
        style="float:left; width: 100%;margin-top:10px"
        
        > 
        <template v-slot:item.checkedEquip="{ item }">
            <v-layout style="margin-left: 22px" >
                <v-checkbox v-model="item.checkedEquip"/>
            </v-layout>
        </template>

        <template v-slot:item.equipment="{item}">
            {{ item.equipment.name }}
        </template>

        <template v-slot:item.notEarlierThan="{ item }">
            <v-edit-dialog
                :return-value="item.notEarlierThan.date"
            > {{ getDateFormat(item.notEarlierThan.date) + " " + (item.notEarlierThan.times.name !== undefined ? item.notEarlierThan.times.name : "")}} 
                <template v-slot:input>
                    <v-date-picker
                        v-model="item.notEarlierThan.date"
                        value= item.notEarlierThan.date
                        color="blue lighten-1"
                        locale="ru"
                        style="margin-top: 15px"
                    ></v-date-picker>
                
            
               
                    <v-select
                        v-model="item.notEarlierThan.times"
                        :items="timesOfDay"
                        cache-items
                        item-text="name"
                        item-value="times"
                        label="Смена"
                        return-object
                    ></v-select>
                </template>
            </v-edit-dialog>
        </template>
        
        </v-data-table>
          </v-container>
        
        <v-card-actions style="margin-top: 15px; margin-bottom: 5px;">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="modalEquipment = false">Отменить</v-btn>
          <v-btn color="blue darken-1" text @click="saveSelectEquipmentItems">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>